export default class GameModel {
  constructor(levelData) {
    this.level = levelData;
    this.steps = levelData.steps;
    this.currentStepIndex = 0;
  }

  getCurrentStep() { return this.steps[this.currentStepIndex]; }
  getTotalSteps() { return this.steps.length; }
  isCorrectObject(objectId) { return objectId === this.getCurrentStep().id; }

  getWrongMessage(objectId) {
    const step = this.getCurrentStep();
    if (step.wrongAnswers && step.wrongAnswers[objectId]) return step.wrongAnswers[objectId];
    return step.defaultWrongMessage || "That doesn't match the clue. Try again.";
  }

  isLastStep() { return this.currentStepIndex === this.steps.length - 1; }

  nextStep() {
    if (this.isLastStep()) return false;
    this.currentStepIndex += 1;
    return true;
  }

  reset() { this.currentStepIndex = 0; }
}
