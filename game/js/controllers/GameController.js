import AudioManager from "../features/AudioManager.js";
import ScoreManager from "../features/ScoreManager.js";
import TimerManager from "../features/TimerManager.js";

import levels from "../../../levels/manifest.js";

import { getZatamUser } from "../../../shared/js/ZatamSession.js";

import { createProgressStore } from "../../../shared/js/ProgressStore.js";

/* =========================================================
   IMPLEMENTED LEVELS
========================================================= */

const implementedLevels = levels
  .filter((level) => level.implemented)
  .sort((a, b) => a.id - b.id);

const levelIds = implementedLevels.map((level) => level.id);

/* =========================================================
   GAME CONTROLLER
========================================================= */

export default class GameController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    /* =====================================================
       FEATURE MANAGERS
    ===================================================== */

    this.audioManager = new AudioManager();

    this.timerManager = new TimerManager();

    /* =====================================================
       LEVEL CONFIGURATION
    ===================================================== */

    this.scoringConfig = {
      maxScore: 100,
      wrongClickPenalty: 5,
      maxTimePenalty: 20,
      chancesPerClue: 3,

      ...(this.model.level.scoring || {}),
    };

    this.timerConfig = {
      durationSeconds: 0,
      perfectTimeSeconds: 0,

      ...(this.model.level.timer || {}),
    };

    this.scoringEnabled = Boolean(this.model.level.settings?.scoring);

    this.timerEnabled = Boolean(
      this.model.level.settings?.timer &&
      Number(this.timerConfig.durationSeconds) > 0,
    );

    this.scoreManager = new ScoreManager(this.scoringConfig);

    /* =====================================================
       PROGRESS STORE
    ===================================================== */

    const user = getZatamUser();

    this.progressStore = createProgressStore(user?.id || "guest", levelIds);

    /* =====================================================
       GAME STATE
    ===================================================== */

    this.inputLocked = false;

    this.DEBUG_HOTSPOTS = false;

    this.autoPlayedAudioSteps = new Set();

    this.pendingAudioInteractionHandler = null;

    this.levelFinished = false;

    this.levelTimedOut = false;

    this.nextLevel = null;

    /* =====================================================
       CLUE CHANCES

       Each clue starts with the full number of chances.

       Example:
       3 / 3
    ===================================================== */

    this.maxChances = Math.max(
      1,
      Number(this.scoringConfig.chancesPerClue) || 3,
    );

    this.chancesLeft = this.maxChances;

    /*
      The stronger hint becomes active when the player reaches:

      1 / 3

      The correct object is highlighted when the player reaches:

      0 / 3
    */

    this.strongHintActive = false;

    this.objectHighlightActive = false;

    this.start();
  }

  /* =========================================================
     START LEVEL
  ========================================================= */

  start() {
    if (this.DEBUG_HOTSPOTS) {
      document.body.classList.add("debug-hotspots");
    }

    this.view.renderLevel(this.model.level);

    this.view.configurePerformance({
      scoringEnabled: this.scoringEnabled,

      timerEnabled: this.timerEnabled,

      maxScore: this.scoringConfig.maxScore,

      maxChances: this.maxChances,
    });

    /* =====================================================
       ROOM INTERACTION
    ===================================================== */

    this.view.bindRoomInteraction(
      (objectId, hotspot) => this.handleObjectClick(objectId, hotspot),

      () => this.handleEmptyRoomClick(),
    );

    /* =====================================================
       POPUP BUTTON
    ===================================================== */

    this.view.bindContinue(() => this.handleContinue());

    /* =====================================================
       AUDIO BUTTON
    ===================================================== */

    this.view.bindAudioClue(() => this.handleAudioClue());

    /* =====================================================
       HOME BUTTON
    ===================================================== */

    this.view.bindHome(() => {
      this.goHome();
    });

    this.render();

    this.startTimer();
  }

  /* =========================================================
     RENDER CURRENT CLUE
  ========================================================= */

  render() {
    this.inputLocked = false;

    this.clearPendingAudioInteraction();

    this.audioManager.stop();

    this.view.clearHelpHighlight();

    const step = this.model.getCurrentStep();

    this.view.renderClue(
      step,

      this.model.currentStepIndex,

      this.model.getTotalSteps(),
    );

    this.view.updateProgress(this.model.currentStepIndex);

    this.view.updateChances(this.chancesLeft, this.maxChances);

    this.updateDisplayedScore();

    this.tryAutoPlayAudio(step);
  }

  /* =========================================================
     RESET CURRENT CLUE HELP / CHANCES

     Called whenever the player moves to a new clue.
  ========================================================= */

  resetClueState() {
    this.chancesLeft = this.maxChances;

    this.strongHintActive = false;

    this.objectHighlightActive = false;

    this.view.clearHelpHighlight();
  }

  /* =========================================================
     TIMER
  ========================================================= */

  startTimer() {
    if (!this.timerEnabled) {
      return;
    }

    const duration = Math.max(
      1,
      Math.floor(Number(this.timerConfig.durationSeconds) || 0),
    );

    this.timerManager.start(
      duration,

      (remainingSeconds) => {
        this.view.updateTimer(remainingSeconds);

        this.updateDisplayedScore();
      },

      () => this.handleTimeExpired(),
    );
  }

  pauseTimer() {
    if (this.timerEnabled) {
      this.timerManager.pause();
    }
  }

  resumeTimer() {
    if (this.timerEnabled && !this.levelFinished && !this.levelTimedOut) {
      this.timerManager.resume();
    }
  }

  handleTimeExpired() {
    if (this.levelFinished || this.levelTimedOut) {
      return;
    }

    this.levelTimedOut = true;

    this.inputLocked = true;

    this.clearPendingAudioInteraction();

    this.audioManager.stop();

    this.view.clearHelpHighlight();

    this.view.updateTimer(0);

    this.updateDisplayedScore();

    /*
      A timed-out attempt is NOT a successful completion.

      Nothing is saved through completeLevel(),
      and the next level remains locked.
    */

    this.view.showTimeUp();
  }

  getElapsedSeconds() {
    if (!this.timerEnabled) {
      return null;
    }

    return this.timerManager.getElapsedSeconds();
  }

  /* =========================================================
     SCORE
  ========================================================= */

  getCurrentScore() {
    if (!this.scoringEnabled) {
      return 0;
    }

    const elapsedSeconds = this.getElapsedSeconds() || 0;

    return this.scoreManager.getScore(elapsedSeconds, this.timerConfig);
  }

  updateDisplayedScore() {
    if (!this.scoringEnabled) {
      return;
    }

    this.view.updateScore(
      this.getCurrentScore(),

      this.scoringConfig.maxScore,
    );
  }

  /* =========================================================
     REGISTER WRONG ATTEMPT

     Any incorrect click counts:

     - wrong clue object
     - decorative area
     - wall
     - floor
     - furniture
     - empty background

     Once chances reach zero, no additional points are lost.
  ========================================================= */

  registerWrongAttempt() {
    if (this.chancesLeft <= 0) {
      return false;
    }

    this.chancesLeft -= 1;

    if (this.scoringEnabled) {
      this.scoreManager.registerWrongClick();

      this.updateDisplayedScore();
    }

    this.view.updateChances(this.chancesLeft, this.maxChances);

    return true;
  }

  /* =========================================================
     STRONGER HINT

     This appears when the player reaches:

     1 / 3

     They still have one real attempt left.
  ========================================================= */

  activateStrongHint(step) {
    if (this.strongHintActive) {
      return;
    }

    this.strongHintActive = true;

    this.view.showHelpHint(step, false);
  }

  /* =========================================================
     HIGHLIGHT CORRECT OBJECT

     This happens after the final wrong attempt:

     0 / 3

     The player must still click the highlighted object.
  ========================================================= */

  activateObjectHighlight(step) {
    this.strongHintActive = true;

    this.objectHighlightActive = true;

    this.view.showHelpHint(step, true);

    this.view.highlightObject(step.id);
  }

  /* =========================================================
     HANDLE ANY WRONG CLICK
  ========================================================= */

  handleWrongAttempt(message, hotspot = null) {
    if (this.inputLocked) {
      return;
    }

    const step = this.model.getCurrentStep();

    /*
      If the object is already highlighted, additional wrong
      clicks do not remove points.
    */

    if (this.chancesLeft <= 0) {
      this.view.showHelpHint(step, true);

      return;
    }

    const counted = this.registerWrongAttempt();

    if (!counted) {
      return;
    }

    /*
      A clickable hotspot can flash when it was selected.

      Empty background clicks have no SVG element to flash.
    */

    if (hotspot) {
      this.view.flashWrong(hotspot);
    }

    /* -------------------------------------------------------
       LAST CHANCE

       After the second wrong click:

       1 / 3

       Show the stronger hint.
    ------------------------------------------------------- */

    if (this.chancesLeft === 1) {
      this.activateStrongHint(step);

      return;
    }

    /* -------------------------------------------------------
       NO CHANCES LEFT

       After the third wrong click:

       0 / 3

       Highlight the correct object.
    ------------------------------------------------------- */

    if (this.chancesLeft === 0) {
      this.activateObjectHighlight(step);

      return;
    }

    /*
      Normal feedback after the first wrong click.
    */

    this.view.showWrongFeedback(message);
  }

  /* =========================================================
     AUDIO AUTOPLAY
  ========================================================= */

  async tryAutoPlayAudio(step) {
    if (
      step.clueType !== "audio" ||
      !step.audioFile ||
      this.autoPlayedAudioSteps.has(step.id)
    ) {
      return;
    }

    this.autoPlayedAudioSteps.add(step.id);

    try {
      await this.audioManager.play(step.audioFile);
    } catch (error) {
      /*
        Some browsers block sound until the user interacts
        with the page.
      */

      console.info(
        "Autoplay blocked. Audio will play after the first user interaction.",
      );

      this.playAudioOnFirstInteraction(step);
    }
  }

  /* =========================================================
     PLAY AUDIO AFTER FIRST INTERACTION
  ========================================================= */

  playAudioOnFirstInteraction(step) {
    this.clearPendingAudioInteraction();

    const handler = (event) => {
      const currentStep = this.model.getCurrentStep();

      if (currentStep.id !== step.id) {
        this.clearPendingAudioInteraction();

        return;
      }

      /*
        The speaker button has its own playback handler.
      */

      if (event.target.closest?.("#audioClueButton")) {
        this.clearPendingAudioInteraction();

        return;
      }

      this.clearPendingAudioInteraction();

      this.audioManager.play(step.audioFile)?.catch((error) => {
        console.error("Unable to play clue audio:", error);
      });
    };

    this.pendingAudioInteractionHandler = handler;

    document.addEventListener("pointerdown", handler, true);

    document.addEventListener("keydown", handler, true);
  }

  /* =========================================================
     CLEAR PENDING AUDIO EVENT
  ========================================================= */

  clearPendingAudioInteraction() {
    if (!this.pendingAudioInteractionHandler) {
      return;
    }

    document.removeEventListener(
      "pointerdown",

      this.pendingAudioInteractionHandler,

      true,
    );

    document.removeEventListener(
      "keydown",

      this.pendingAudioInteractionHandler,

      true,
    );

    this.pendingAudioInteractionHandler = null;
  }

  /* =========================================================
     MANUAL AUDIO REPLAY
  ========================================================= */

  handleAudioClue() {
    const step = this.model.getCurrentStep();

    if (step.clueType !== "audio" || !step.audioFile) {
      return;
    }

    this.clearPendingAudioInteraction();

    this.audioManager.play(step.audioFile)?.catch((error) => {
      console.error("Unable to play clue audio:", error);
    });
  }

  /* =========================================================
     OBJECT CLICK
  ========================================================= */

  handleObjectClick(objectId, hotspot) {
    if (this.inputLocked) {
      return;
    }

    /* =====================================================
       WRONG OBJECT

       Even if this object becomes correct later in the level,
       it is wrong for the CURRENT clue and costs one chance.
    ===================================================== */

    if (!this.model.isCorrectObject(objectId)) {
      const message = this.model.getWrongMessage(objectId);

      this.handleWrongAttempt(message, hotspot);

      return;
    }

    /* =====================================================
       CORRECT OBJECT
    ===================================================== */

    this.inputLocked = true;

    /*
      Pause the timer while the player reads the story popup.

      Reading time should not hurt the level score.
    */

    this.pauseTimer();

    this.clearPendingAudioInteraction();

    this.audioManager.stop();

    this.view.clearHelpHighlight();

    this.view.showCorrectFeedback();

    this.view.flashCorrect(hotspot);

    const step = this.model.getCurrentStep();

    const isLastStep = this.model.isLastStep();

    window.setTimeout(
      () => {
        this.view.showStoryPopup(step, isLastStep);
      },

      400,
    );
  }

  /* =========================================================
     EMPTY ROOM CLICK

     Empty background clicks now count exactly like any
     other wrong attempt.
  ========================================================= */

  handleEmptyRoomClick() {
    if (this.inputLocked) {
      return;
    }

    this.handleWrongAttempt("That does not match the clue. Try again.");
  }

  /* =========================================================
     CONTINUE BUTTON
  ========================================================= */

  handleContinue() {
    this.clearPendingAudioInteraction();

    this.audioManager.stop();

    /* =====================================================
       TIME EXPIRED
    ===================================================== */

    if (this.levelTimedOut) {
      this.restartLevel();

      return;
    }

    /* =====================================================
       LEVEL IS ALREADY FINISHED
    ===================================================== */

    if (this.levelFinished) {
      if (this.nextLevel) {
        const url = new URL(window.location.href);

        url.searchParams.set(
          "level",

          String(this.nextLevel.id),
        );

        window.location.href = url.href;

        return;
      }

      this.goHome();

      return;
    }

    /* =====================================================
       HIDE STORY POPUP
    ===================================================== */

    this.view.hideStoryPopup();

    /* =====================================================
       FINAL CLUE
    ===================================================== */

    if (this.model.isLastStep()) {
      this.finishLevel();

      return;
    }

    /* =====================================================
       MOVE TO NEXT CLUE
    ===================================================== */

    this.model.nextStep();

    this.resetClueState();

    this.render();

    this.resumeTimer();
  }

  /* =========================================================
     FINISH LEVEL
  ========================================================= */

  finishLevel() {
    this.clearPendingAudioInteraction();

    this.audioManager.stop();

    this.timerManager.stop();

    this.inputLocked = true;

    const elapsedSeconds = this.getElapsedSeconds();

    const finalScore = this.scoringEnabled ? this.getCurrentScore() : 0;

    /*
      Save successful completion through ProgressStore.

      ProgressStore keeps the best score and fastest time.
    */

    const savedState = this.progressStore.completeLevel(
      this.model.level.id,

      {
        score: finalScore,

        timeSeconds: elapsedSeconds,
      },
    );

    console.log(`✅ Level ${this.model.level.id} completed`, savedState);

    this.levelFinished = true;

    /* =====================================================
       FIND NEXT IMPLEMENTED LEVEL
    ===================================================== */

    const currentIndex = implementedLevels.findIndex(
      (level) => level.id === this.model.level.id,
    );

    if (currentIndex >= 0 && currentIndex < implementedLevels.length - 1) {
      this.nextLevel = implementedLevels[currentIndex + 1];
    } else {
      this.nextLevel = null;
    }

    /* =====================================================
       COMPLETE SIDEBAR
    ===================================================== */

    this.view.updateProgress(
      this.model.currentStepIndex,

      true,
    );

    /* =====================================================
       COMPLETE CLUE AREA
    ===================================================== */

    this.view.showFinished(this.model.level.completion || {});

    /* =====================================================
       COMPLETION POPUP
    ===================================================== */

    this.view.showLevelComplete(
      this.model.level.completion || {},

      this.nextLevel,

      {
        score: finalScore,

        maxScore: this.scoringConfig.maxScore,

        elapsedSeconds,

        showScore: this.scoringEnabled,

        showTime: this.timerEnabled,
      },
    );
  }

  /* =========================================================
     RESTART LEVEL
  ========================================================= */

  restartLevel() {
    this.timerManager.stop();

    this.clearPendingAudioInteraction();

    this.audioManager.stop();

    window.location.reload();
  }

  /* =========================================================
     GO HOME
  ========================================================= */

  goHome() {
    this.timerManager.stop();

    this.clearPendingAudioInteraction();

    this.audioManager.stop();

    window.location.href = new URL(
      "../index.html",

      window.location.href,
    ).href;
  }
}
