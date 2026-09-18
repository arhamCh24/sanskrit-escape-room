export default class Level1Controller {
  constructor(model, view) {
    this.model = model;

    this.view = view;

    /*
      Change this to true
      ONLY when positioning
      or testing hotspots.
    */

    this.DEBUG_HOTSPOTS = false;

    this.start();
  }

  /* =========================
     START LEVEL
  ========================== */

  start() {
    if (this.DEBUG_HOTSPOTS) {
      document.body.classList.add("debug-hotspots");
    }

    this.view.bindHotspotClick((objectId, hotspot) => {
      this.handleObjectClick(objectId, hotspot);
    });

    this.view.bindRoomClick(() => {
      this.handleEmptyRoomClick();
    });

    this.view.bindContinue(() => {
      this.handleContinue();
    });

    this.render();
  }

  /* =========================
     RENDER
  ========================== */

  render() {
    const step = this.model.getCurrentStep();

    this.view.renderClue(step);

    this.view.updateProgress(this.model.currentStepIndex);
  }

  /* =========================
     OBJECT CLICK
  ========================== */

  handleObjectClick(objectId, hotspot) {
    /*
      WRONG OBJECT
    */

    if (!this.model.isCorrectObject(objectId)) {
      const message = this.model.getWrongMessage(objectId);

      this.view.showWrongFeedback(message);

      this.view.flashWrong(hotspot);

      return;
    }

    /*
      CORRECT OBJECT
    */

    this.view.showCorrectFeedback();

    this.view.flashCorrect(hotspot);

    const currentStep = this.model.getCurrentStep();

    /*
      Brief delay so the child
      sees the correct highlight.
    */

    setTimeout(() => {
      this.view.showStoryPopup(currentStep);
    }, 450);
  }

  /* =========================
     CLICK EMPTY PART OF ROOM
  ========================== */

  handleEmptyRoomClick() {
    this.view.showWrongFeedback(
      "Nothing useful there. Look carefully and try again!",
    );
  }

  /* =========================
     CONTINUE STORY
  ========================== */

  handleContinue() {
    this.view.hideStoryPopup();

    /*
      Final door completed.
    */

    if (this.model.isLastStep()) {
      this.finishLevel();

      return;
    }

    /*
      Unlock next clue.
    */

    this.model.nextStep();

    this.render();
  }

  /* =========================
     COMPLETE LEVEL
  ========================== */

  finishLevel() {
    this.view.showFinished();

    this.view.updateProgress(this.model.currentStepIndex, true);

    /*
      Save Level 1 completion.

      Project-specific key so it
      does not interfere with other
      websites using localStorage.
    */

    localStorage.setItem("sanskritEscapeRoom_level1", "complete");
  }
}
