import AudioManager from "../features/AudioManager.js";

import levels from "../../../levels/manifest.js";

import { getZatamUser } from "../../../shared/js/ZatamSession.js";

import { createProgressStore } from "../../../shared/js/ProgressStore.js";

/* =========================================================
   IMPLEMENTED LEVELS

   Use the same real playable levels as the homepage.
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
       AUDIO
    ===================================================== */

    this.audioManager = new AudioManager();

    /* =====================================================
       PROGRESS STORE

       IMPORTANT FIX:

       GameModel does NOT save progress.

       The controller talks directly to the same
       ProgressStore used by the homepage.
    ===================================================== */

    const user = getZatamUser();

    this.progressStore = createProgressStore(user?.id || "guest", levelIds);

    /* =====================================================
       GAME STATE
    ===================================================== */

    this.inputLocked = false;

    this.DEBUG_HOTSPOTS = false;

    // Tracks audio clues that already attempted autoplay.
    this.autoPlayedAudioSteps = new Set();

    // Used when browser blocks autoplay.
    this.pendingAudioInteractionHandler = null;

    // Becomes true after the whole level is completed.
    this.levelFinished = false;

    // Stores the next implemented level.
    this.nextLevel = null;

    this.start();
  }

  /* =========================================================
     START
  ========================================================= */

  start() {
    if (this.DEBUG_HOTSPOTS) {
      document.body.classList.add("debug-hotspots");
    }

    this.view.renderLevel(this.model.level);

    /* =====================================================
       ROOM CLICKS
    ===================================================== */

    this.view.bindRoomInteraction(
      (objectId, hotspot) => this.handleObjectClick(objectId, hotspot),

      () => this.handleEmptyRoomClick(),
    );

    /* =====================================================
       POPUP CONTINUE / NEXT LEVEL BUTTON
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
  }

  /* =========================================================
     RENDER CURRENT CLUE
  ========================================================= */

  render() {
    this.inputLocked = false;

    this.clearPendingAudioInteraction();

    this.audioManager.stop();

    const step = this.model.getCurrentStep();

    this.view.renderClue(
      step,

      this.model.currentStepIndex,

      this.model.getTotalSteps(),
    );

    this.view.updateProgress(this.model.currentStepIndex);

    /* =====================================================
       TRY TO AUTOPLAY AUDIO CLUE
    ===================================================== */

    this.tryAutoPlayAudio(step);
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
        Browsers may block sound before the
        user interacts with the page.
      */

      console.info(
        "Autoplay blocked. Audio will play after the first user interaction.",
      );

      this.playAudioOnFirstInteraction(step);
    }
  }

  /* =========================================================
     PLAY AUDIO AFTER FIRST USER INTERACTION
  ========================================================= */

  playAudioOnFirstInteraction(step) {
    this.clearPendingAudioInteraction();

    const handler = (event) => {
      const currentStep = this.model.getCurrentStep();

      /*
        Player may already be on another clue.
      */

      if (currentStep.id !== step.id) {
        this.clearPendingAudioInteraction();

        return;
      }

      /*
        Speaker button has its own playback
        handler.
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
    ===================================================== */

    if (!this.model.isCorrectObject(objectId)) {
      const message = this.model.getWrongMessage(objectId);

      this.view.showWrongFeedback(message);

      this.view.flashWrong(hotspot);

      return;
    }

    /* =====================================================
       CORRECT OBJECT
    ===================================================== */

    this.inputLocked = true;

    this.clearPendingAudioInteraction();

    this.audioManager.stop();

    this.view.showCorrectFeedback();

    this.view.flashCorrect(hotspot);

    const step = this.model.getCurrentStep();

    const isLastStep = this.model.isLastStep();

    setTimeout(
      () => {
        this.view.showStoryPopup(
          step,

          isLastStep,
        );
      },

      400,
    );
  }

  /* =========================================================
     EMPTY ROOM CLICK
  ========================================================= */

  handleEmptyRoomClick() {
    if (this.inputLocked) {
      return;
    }

    this.view.showWrongFeedback("Nothing useful there. Look around again.");
  }

  /* =========================================================
     CONTINUE BUTTON
  ========================================================= */

  handleContinue() {
    this.clearPendingAudioInteraction();

    this.audioManager.stop();

    /* =====================================================
       LEVEL IS ALREADY FINISHED

       This means the button currently says:

       Next Level — ...
       or
       Return Home
    ===================================================== */

    if (this.levelFinished) {
      /* ===================================================
         NEXT LEVEL EXISTS
      =================================================== */

      if (this.nextLevel) {
        /*
          We stay on game.html and only change
          ?level=1 → ?level=2.

          This is safe locally, GitHub Pages,
          and later inside zat.am.
        */

        const url = new URL(window.location.href);

        url.searchParams.set(
          "level",

          String(this.nextLevel.id),
        );

        window.location.href = url.href;

        return;
      }

      /* ===================================================
         NO MORE LEVELS
      =================================================== */

      this.goHome();

      return;
    }

    /* =====================================================
       HIDE NORMAL STORY POPUP
    ===================================================== */

    this.view.hideStoryPopup();

    /* =====================================================
       FINAL CLUE WAS JUST COMPLETED

       NOW SAVE THE LEVEL.
    ===================================================== */

    if (this.model.isLastStep()) {
      this.finishLevel();

      return;
    }

    /* =====================================================
       MOVE TO NEXT CLUE
    ===================================================== */

    this.model.nextStep();

    this.render();
  }

  /* =========================================================
     FINISH LEVEL
  ========================================================= */

  finishLevel() {
    this.clearPendingAudioInteraction();

    this.audioManager.stop();

    this.inputLocked = true;

    /* =====================================================
       IMPORTANT

       Save through ProgressStore.

       OLD BROKEN CODE WAS:

       this.model.saveCompletion();

       GameModel has no such function.
    ===================================================== */

    const savedState = this.progressStore.completeLevel(this.model.level.id);

    console.log(`✅ Level ${this.model.level.id} completed`, savedState);

    /* =====================================================
       MARK CONTROLLER FINISHED
    ===================================================== */

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
       SHOW PROPER COMPLETION POPUP
    ===================================================== */

    this.view.showLevelComplete(
      this.model.level.completion || {},

      this.nextLevel,
    );
  }

  /* =========================================================
     GO HOME
  ========================================================= */

  goHome() {
    this.clearPendingAudioInteraction();

    this.audioManager.stop();

    /*
      Current page:

      /game/game.html

      ../index.html gives:

      /index.html

      Relative routing is better for future
      zat.am integration.
    */

    window.location.href = new URL(
      "../index.html",

      window.location.href,
    ).href;
  }
}
