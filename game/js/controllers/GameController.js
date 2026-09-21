export default class GameController {
  constructor(model, view, { onComplete = null } = {}) {
    this.model = model;
    this.view = view;
    this.onComplete = onComplete;
    this.inputLocked = false;
    this.DEBUG_HOTSPOTS = false;
    this.start();
  }

  start() {
    if (this.DEBUG_HOTSPOTS) document.body.classList.add("debug-hotspots");
    this.view.renderLevel(this.model.level);
    this.view.bindRoomInteraction((objectId, hotspot) => this.handleObjectClick(objectId, hotspot), () => this.handleEmptyRoomClick());
    this.view.bindContinue(() => this.handleContinue());
    this.render();
  }

  render() {
    this.inputLocked = false;
    const step = this.model.getCurrentStep();
    this.view.renderClue(step, this.model.currentStepIndex, this.model.getTotalSteps());
    this.view.updateProgress(this.model.currentStepIndex);
  }

  handleObjectClick(objectId, hotspot) {
    if (this.inputLocked) return;

    if (!this.model.isCorrectObject(objectId)) {
      this.view.showWrongFeedback(this.model.getWrongMessage(objectId));
      this.view.flashWrong(hotspot);
      return;
    }

    this.inputLocked = true;
    this.view.showCorrectFeedback();
    this.view.flashCorrect(hotspot);
    const step = this.model.getCurrentStep();
    const isLastStep = this.model.isLastStep();
    setTimeout(() => this.view.showStoryPopup(step, isLastStep), 400);
  }

  handleEmptyRoomClick() {
    if (this.inputLocked) return;
    this.view.showWrongFeedback("Nothing useful there. Look around again.");
  }

  handleContinue() {
    this.view.hideStoryPopup();
    if (this.model.isLastStep()) {
      this.finishLevel();
      return;
    }
    this.model.nextStep();
    this.render();
  }

  finishLevel() {
    this.inputLocked = true;
    this.onComplete?.({ levelId: this.model.level.id });
    this.view.showFinished(this.model.level.completion || {});
    this.view.updateProgress(this.model.currentStepIndex, true);
  }
}
