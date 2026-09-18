export default class Level1Model {
  constructor() {
    this.currentStepIndex = 0;

    this.steps = [
      /* =========================
         STEP 1 — BOOK
      ========================== */

      {
        id: "book",

        sanskrit: "पुस्तकम्",

        clue: "Find the standing green book on the lower bookshelf, just to the left of the flower pot.",

        title: "You found the green book!",

        story:
          "Inside the book is a note: “It is getting dark. Find something that gives us light.”",

        wrongAnswers: {
          "other-book": "That is a book, but not the green one. Try again!",

          plant: "That is the flower pot. Look just to the left of it!",
        },
      },

      /* =========================
         STEP 2 — LAMP
      ========================== */

      {
        id: "lamp",

        sanskrit: "दीपः",

        clue: "Find the object that gives us light.",

        title: "You found the lamp!",

        story:
          "The lamp lights up a hidden message: “Look near the place where you sit.”",
      },

      /* =========================
         STEP 3 — CHAIR
      ========================== */

      {
        id: "chair",

        sanskrit: "आसन्दः",

        clue: "Find the object that you can sit on.",

        title: "You found the chair!",

        story:
          "Under the chair is another clue: “The key is hidden inside the old chest.”",
      },

      /* =========================
         STEP 4 — CHEST / KEY
      ========================== */

      {
        id: "chest",

        sanskrit: "कुञ्चिका",

        clue: "The clue says the key is hidden inside an old chest. Find the chest.",

        title: "You found the key!",

        story:
          "Inside the chest is कुञ्चिका — the key! Now use it to find the door and escape.",
      },

      /* =========================
         STEP 5 — DOOR
      ========================== */

      {
        id: "door",

        sanskrit: "द्वारम्",

        clue: "You have the key. Find the door and escape.",

        title: "Room Escaped! 🎉",

        story:
          "Great job! You followed all the clues, found the key, and escaped Level 1.",
      },
    ];
  }

  /* =========================
     GET CURRENT STEP
  ========================== */

  getCurrentStep() {
    return this.steps[this.currentStepIndex];
  }

  /* =========================
     CHECK ANSWER
  ========================== */

  isCorrectObject(objectId) {
    return objectId === this.getCurrentStep().id;
  }

  /* =========================
     WRONG ANSWER MESSAGE
  ========================== */

  getWrongMessage(objectId) {
    const step = this.getCurrentStep();

    if (step.wrongAnswers && step.wrongAnswers[objectId]) {
      return step.wrongAnswers[objectId];
    }

    return "Not this one. Read the clue and try again!";
  }

  /* =========================
     IS LAST STEP?
  ========================== */

  isLastStep() {
    return this.currentStepIndex === this.steps.length - 1;
  }

  /* =========================
     MOVE TO NEXT STEP
  ========================== */

  nextStep() {
    if (!this.isLastStep()) {
      this.currentStepIndex++;

      return true;
    }

    return false;
  }

  /* =========================
     RESET LEVEL
  ========================== */

  reset() {
    this.currentStepIndex = 0;
  }
}
