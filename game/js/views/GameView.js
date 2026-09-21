export default class GameView {
  constructor() {
    this.levelBadge = document.getElementById("levelBadge");
    this.roomName = document.getElementById("roomName");
    this.gameTitle = document.getElementById("gameTitle");
    this.missionText = document.getElementById("missionText");

    this.clueProgress = document.getElementById("clueProgress");
    this.sanskritWord = document.getElementById("sanskritWord");
    this.englishClue = document.getElementById("englishClue");
    this.feedback = document.getElementById("feedback");

    this.roomStage = document.getElementById("roomStage");
    this.roomPanel = document.getElementById("roomPanel");
    this.roomMap = document.getElementById("roomMap");
    this.roomBackground = document.getElementById("roomBackground");
    this.hotspotLayer = document.getElementById("hotspotLayer");

    this.progressList = document.getElementById("progressList");
    this.progressCounter = document.getElementById("progressCounter");
    this.tipText = document.getElementById("tipText");

    this.popup = document.getElementById("storyPopup");
    this.popupTitle = document.getElementById("popupTitle");
    this.popupMessage = document.getElementById("popupMessage");
    this.continueButton = document.getElementById("continueButton");

    this.loadError = document.getElementById("loadError");

    this.roomWidth = 1672;
    this.roomHeight = 941;
    this.resizeObserver = null;
  }

  renderLevel(level) {
    this.levelBadge.textContent = `LEVEL ${level.id}`;
    this.roomName.textContent = level.roomName || `LEVEL ${level.id}`;
    this.gameTitle.textContent = level.gameTitle || "Sanskrit Escape Room";
    this.missionText.textContent = level.mission || "Find the key and escape";
    this.tipText.textContent = level.tip || "Look carefully around the room.";

    this.roomWidth = level.room.width;
    this.roomHeight = level.room.height;

    this.roomMap.setAttribute(
      "viewBox",
      `0 0 ${this.roomWidth} ${this.roomHeight}`
    );

    this.roomBackground.setAttribute("href", level.room.backgroundUrl);
    this.roomBackground.setAttribute("width", this.roomWidth);
    this.roomBackground.setAttribute("height", this.roomHeight);

    this.roomPanel.style.aspectRatio =
      `${this.roomWidth} / ${this.roomHeight}`;

    this.renderHotspots(level.hotspots || []);
    this.renderProgress(level.steps || []);
    this.startResponsiveRoom();
  }

  renderHotspots(hotspots) {
    this.hotspotLayer.innerHTML = "";

    hotspots.forEach(hotspotData => {
      let element;

      if (hotspotData.type === "polygon") {
        element = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "polygon"
        );
        element.setAttribute("points", hotspotData.points);
      }
      else if (hotspotData.type === "circle") {
        element = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
        element.setAttribute("cx", hotspotData.cx);
        element.setAttribute("cy", hotspotData.cy);
        element.setAttribute("r", hotspotData.r);
      }
      else if (hotspotData.type === "rect") {
        element = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        element.setAttribute("x", hotspotData.x);
        element.setAttribute("y", hotspotData.y);
        element.setAttribute("width", hotspotData.width);
        element.setAttribute("height", hotspotData.height);
      }
      else {
        console.warn("Unknown hotspot type:", hotspotData.type);
        return;
      }

      element.classList.add("hotspot");
      element.dataset.object = hotspotData.object;
      element.setAttribute("tabindex", "0");
      element.setAttribute("role", "button");
      element.setAttribute("aria-label", "Interactive room object");

      this.hotspotLayer.appendChild(element);
    });
  }

  renderProgress(steps) {
    this.progressList.innerHTML = "";
    this.progressList.style.setProperty("--progress-count", steps.length || 1);

    steps.forEach((step, index) => {
      const item = document.createElement("div");

      item.className = index === 0 ? "step active" : "step locked";
      item.dataset.step = step.id;
      item.dataset.foundLabel = step.foundLabel;

      item.innerHTML = `
        <span class="step-number">${index + 1}</span>
        <div class="step-copy">
          <strong class="step-title">Clue ${index + 1}</strong>
          <small class="step-status">${index === 0 ? "In progress" : "Locked"}</small>
        </div>
      `;

      this.progressList.appendChild(item);
    });
  }

  renderClue(step, currentIndex, totalSteps) {
    this.clueProgress.textContent =
      `CLUE ${currentIndex + 1} OF ${totalSteps}`;

    this.sanskritWord.textContent = step.sanskrit;
    this.englishClue.textContent = step.hint;
    this.feedback.textContent = "";
  }

  updateProgress(currentIndex, finished = false) {
    const progressSteps =
      this.progressList.querySelectorAll(".step");

    const total = progressSteps.length;

    progressSteps.forEach((step, index) => {
      step.classList.remove("active", "locked", "complete");

      const title = step.querySelector(".step-title");
      const status = step.querySelector(".step-status");
      const foundLabel = step.dataset.foundLabel;

      if (finished) {
        step.classList.add("complete");
        title.textContent = foundLabel;
        status.textContent = "Found";
        return;
      }

      if (index < currentIndex) {
        step.classList.add("complete");
        title.textContent = foundLabel;
        status.textContent = "Found";
      }
      else if (index === currentIndex) {
        step.classList.add("active");
        title.textContent = `Clue ${index + 1}`;
        status.textContent = "In progress";
      }
      else {
        step.classList.add("locked");
        title.textContent = `Clue ${index + 1}`;
        status.textContent = "Locked";
      }
    });

    this.progressCounter.textContent =
      finished
        ? `${total} / ${total}`
        : `${currentIndex + 1} / ${total}`;
  }

  fitRoom() {
    const desktop = window.matchMedia("(min-width: 1025px)").matches;

    if (!desktop) {
      this.roomPanel.style.width = "100%";
      this.roomPanel.style.height = "auto";
      return;
    }

    const availableWidth = this.roomStage.clientWidth;
    const availableHeight = this.roomStage.clientHeight;

    if (availableWidth <= 0 || availableHeight <= 0) return;

    const ratio = this.roomWidth / this.roomHeight;

    let width = availableWidth;
    let height = width / ratio;

    if (height > availableHeight) {
      height = availableHeight;
      width = height * ratio;
    }

    this.roomPanel.style.width = `${Math.floor(width)}px`;
    this.roomPanel.style.height = `${Math.floor(height)}px`;
  }

  startResponsiveRoom() {
    this.fitRoom();

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    if ("ResizeObserver" in window) {
      this.resizeObserver = new ResizeObserver(() => this.fitRoom());
      this.resizeObserver.observe(this.roomStage);
    }

    window.addEventListener("resize", () => this.fitRoom());
  }

  showWrongFeedback(message) {
    this.feedback.textContent = "↻ " + message;
  }

  showCorrectFeedback() {
    this.feedback.textContent = "✓ You found it!";
  }

  flashCorrect(element) {
    element.classList.add("correct");
    setTimeout(() => element.classList.remove("correct"), 450);
  }

  flashWrong(element) {
    element.classList.add("wrong");
    setTimeout(() => element.classList.remove("wrong"), 250);
  }

  bindRoomInteraction(objectHandler, emptyHandler) {
    this.roomMap.addEventListener("click", event => {
      const hotspot = event.target.closest(".hotspot");

      if (hotspot) {
        objectHandler(hotspot.dataset.object, hotspot);
        return;
      }

      emptyHandler();
    });

    this.roomMap.addEventListener("keydown", event => {
      const hotspot = event.target.closest(".hotspot");
      if (!hotspot) return;

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        objectHandler(hotspot.dataset.object, hotspot);
      }
    });
  }

  showStoryPopup(step, isLastStep) {
    this.popupTitle.textContent = step.title;
    this.popupMessage.textContent = step.story;
    this.continueButton.textContent = isLastStep ? "Escape Room" : "Continue";
    this.popup.classList.remove("hidden");
    this.continueButton.focus();
  }

  hideStoryPopup() {
    this.popup.classList.add("hidden");
  }

  bindContinue(handler) {
    this.continueButton.addEventListener("click", handler);
  }

  showFinished(completion) {
    this.clueProgress.textContent = "LEVEL COMPLETE";
    this.sanskritWord.textContent = completion.sanskrit || "उत्तमम्!";
    this.englishClue.textContent = completion.message || "You escaped the room!";
    this.feedback.textContent = "";
  }

  showLoadError() {
    this.loadError.classList.remove("hidden");
  }
}
