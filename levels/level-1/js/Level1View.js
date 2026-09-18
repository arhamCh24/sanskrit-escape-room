export default class Level1View {
  constructor() {
    this.sanskritWord = document.getElementById("sanskritWord");

    this.englishClue = document.getElementById("englishClue");

    this.feedback = document.getElementById("feedback");

    this.popup = document.getElementById("storyPopup");

    this.popupTitle = document.getElementById("popupTitle");

    this.popupMessage = document.getElementById("popupMessage");

    this.continueButton = document.getElementById("continueButton");

    this.roomMap = document.getElementById("roomMap");

    this.hotspots = document.querySelectorAll(".hotspot");

    this.progressSteps = document.querySelectorAll(".step");
  }

  /* =========================
     DISPLAY CURRENT CLUE
  ========================== */

  renderClue(step) {
    this.sanskritWord.textContent = step.sanskrit;

    this.englishClue.textContent = step.clue;

    this.feedback.textContent = "";
  }

  /* =========================
     FEEDBACK
  ========================== */

  showWrongFeedback(message) {
    this.feedback.textContent = "❌ " + message;
  }

  showCorrectFeedback() {
    this.feedback.textContent = "✅ Correct!";
  }

  /* =========================
     POPUP
  ========================== */

  showStoryPopup(step) {
    this.popupTitle.textContent = step.title;

    this.popupMessage.textContent = step.story;

    this.popup.classList.remove("hidden");
  }

  hideStoryPopup() {
    this.popup.classList.add("hidden");
  }

  /* =========================
     PROGRESS BAR
  ========================== */

  updateProgress(currentIndex, finished = false) {
    this.progressSteps.forEach((step, index) => {
      step.classList.remove("active", "locked", "complete");

      if (finished) {
        step.classList.add("complete");

        return;
      }

      if (index < currentIndex) {
        step.classList.add("complete");
      } else if (index === currentIndex) {
        step.classList.add("active");
      } else {
        step.classList.add("locked");
      }
    });
  }

  /* =========================
     CORRECT OBJECT FLASH
  ========================== */

  flashCorrect(hotspot) {
    hotspot.classList.add("correct");

    setTimeout(() => {
      hotspot.classList.remove("correct");
    }, 500);
  }

  /* =========================
     WRONG OBJECT FLASH
  ========================== */

  flashWrong(hotspot) {
    hotspot.classList.add("wrong");

    setTimeout(() => {
      hotspot.classList.remove("wrong");
    }, 300);
  }

  /* =========================
     CLICK LISTENERS
  ========================== */

  bindHotspotClick(handler) {
    this.hotspots.forEach((hotspot) => {
      hotspot.addEventListener("click", (event) => {
        /*
              Prevent click from also
              counting as a click on
              empty room area.
            */

        event.stopPropagation();

        handler(hotspot.dataset.object, hotspot);
      });
    });
  }

  /* =========================
     EMPTY ROOM CLICK
  ========================== */

  bindRoomClick(handler) {
    this.roomMap.addEventListener("click", () => {
      handler();
    });
  }

  /* =========================
     CONTINUE BUTTON
  ========================== */

  bindContinue(handler) {
    this.continueButton.addEventListener("click", handler);
  }

  /* =========================
     FINISHED MESSAGE
  ========================== */

  showFinished() {
    this.sanskritWord.textContent = "Level Complete! 🎉";

    this.englishClue.textContent = "You escaped the room!";

    this.feedback.textContent = "";
  }
}
