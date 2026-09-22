export default class GameView {
  constructor() {
    // =========================================================
    // HEADER / LEVEL INFORMATION
    // =========================================================

    this.levelBadge = document.getElementById("levelBadge");

    this.roomName = document.getElementById("roomName");

    this.gameTitle = document.getElementById("gameTitle");

    this.missionText = document.getElementById("missionText");

    // =========================================================
    // CLUE AREA
    // =========================================================

    this.clueProgress = document.getElementById("clueProgress");

    this.sanskritWord = document.getElementById("sanskritWord");

    this.englishClue = document.getElementById("englishClue");

    this.feedback = document.getElementById("feedback");

    // =========================================================
    // AUDIO CLUE UI
    //
    // Creates a small replay icon beside the hint instead
    // of a large "Listen to clue" button.
    // =========================================================

    this.audioClueLine = document.createElement("div");

    this.audioClueLine.className = "audio-clue-row";

    // Insert the row where englishClue currently sits.
    this.englishClue.parentNode.insertBefore(
      this.audioClueLine,
      this.englishClue,
    );

    // Move existing clue text into the new row.
    this.audioClueLine.appendChild(this.englishClue);

    // Create replay-audio button.
    this.audioClueButton = document.createElement("button");

    this.audioClueButton.type = "button";

    this.audioClueButton.id = "audioClueButton";

    this.audioClueButton.className = "audio-clue-icon hidden";

    this.audioClueButton.setAttribute(
      "aria-label",
      "Replay Sanskrit audio clue",
    );

    this.audioClueButton.title = "Replay audio clue";

    // Professional SVG speaker icon.
    this.audioClueButton.innerHTML = `
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M4 9v6h4l5 4V5L8 9H4z"
          fill="currentColor"
        />

        <path
          d="M16 8.5a5 5 0 0 1 0 7"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
        />

        <path
          d="M18.5 6a8.5 8.5 0 0 1 0 12"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
        />
      </svg>
    `;

    this.audioClueLine.appendChild(this.audioClueButton);

    // =========================================================
    // ROOM
    // =========================================================

    this.roomStage = document.getElementById("roomStage");

    this.roomPanel = document.getElementById("roomPanel");

    this.roomMap = document.getElementById("roomMap");

    this.roomBackground = document.getElementById("roomBackground");

    this.hotspotLayer = document.getElementById("hotspotLayer");

    // =========================================================
    // PROGRESS
    // =========================================================

    this.progressList = document.getElementById("progressList");

    this.progressCounter = document.getElementById("progressCounter");

    this.tipText = document.getElementById("tipText");

    // =========================================================
    // STORY POPUP
    // =========================================================

    this.popup = document.getElementById("storyPopup");

    this.popupTitle = document.getElementById("popupTitle");

    this.popupMessage = document.getElementById("popupMessage");

    this.continueButton = document.getElementById("continueButton");

    // =========================================================
    // SECONDARY HOME BUTTON
    // =========================================================

    this.homeButton = document.createElement("button");

    this.homeButton.type = "button";
    this.homeButton.id = "homeButton";

    this.homeButton.className = "completion-home-button hidden";

    this.homeButton.textContent = "Back to Home";

    this.continueButton.insertAdjacentElement("afterend", this.homeButton);

    // =========================================================
    // ERROR SCREEN
    // =========================================================

    this.loadError = document.getElementById("loadError");

    // =========================================================
    // ROOM DIMENSIONS
    // =========================================================

    this.roomWidth = 1672;
    this.roomHeight = 941;

    this.resizeObserver = null;

    this.windowResizeHandler = () => this.fitRoom();
  }

  // =========================================================
  // RENDER LEVEL
  // =========================================================

  renderLevel(level) {
    this.levelBadge.textContent = `LEVEL ${level.id}`;

    this.roomName.textContent = level.roomName || `LEVEL ${level.id}`;

    this.gameTitle.textContent = level.gameTitle || "Sanskrit Escape Room";

    this.missionText.textContent = level.mission || "Find the key and escape.";

    this.tipText.textContent = level.tip || "Look carefully around the room.";

    // Room dimensions
    this.roomWidth = level.room.width;

    this.roomHeight = level.room.height;

    // SVG viewBox
    this.roomMap.setAttribute(
      "viewBox",
      `0 0 ${this.roomWidth} ${this.roomHeight}`,
    );

    // Background image
    this.roomBackground.setAttribute("href", level.room.backgroundUrl);

    this.roomBackground.setAttribute("width", this.roomWidth);

    this.roomBackground.setAttribute("height", this.roomHeight);

    // Keep original image ratio.
    this.roomPanel.style.aspectRatio = `${this.roomWidth} / ${this.roomHeight}`;

    // Build level UI.
    this.renderHotspots(level.hotspots || []);

    this.renderProgress(level.steps || []);

    this.startResponsiveRoom();
  }

  // =========================================================
  // HOTSPOTS
  // =========================================================

  renderHotspots(hotspots) {
    this.hotspotLayer.innerHTML = "";

    hotspots.forEach((hotspotData) => {
      let element;

      // -----------------------------
      // POLYGON
      // -----------------------------

      if (hotspotData.type === "polygon") {
        element = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "polygon",
        );

        element.setAttribute("points", hotspotData.points);
      }

      // -----------------------------
      // CIRCLE
      // -----------------------------
      else if (hotspotData.type === "circle") {
        element = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle",
        );

        element.setAttribute("cx", hotspotData.cx);

        element.setAttribute("cy", hotspotData.cy);

        element.setAttribute("r", hotspotData.r);
      }

      // -----------------------------
      // RECTANGLE
      // -----------------------------
      else if (hotspotData.type === "rect") {
        element = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect",
        );

        element.setAttribute("x", hotspotData.x);

        element.setAttribute("y", hotspotData.y);

        element.setAttribute("width", hotspotData.width);

        element.setAttribute("height", hotspotData.height);
      }

      // -----------------------------
      // UNKNOWN TYPE
      // -----------------------------
      else {
        console.warn("Unknown hotspot type:", hotspotData.type);

        return;
      }

      // Shared hotspot properties.
      element.classList.add("hotspot");

      element.dataset.object = hotspotData.object;

      element.setAttribute("tabindex", "0");

      element.setAttribute("role", "button");

      element.setAttribute("aria-label", "Interactive room object");

      this.hotspotLayer.appendChild(element);
    });
  }

  // =========================================================
  // PROGRESS SIDEBAR
  // =========================================================

  renderProgress(steps) {
    this.progressList.innerHTML = "";

    this.progressList.style.setProperty("--progress-count", steps.length || 1);

    steps.forEach((step, index) => {
      const item = document.createElement("div");

      item.className = index === 0 ? "step active" : "step locked";

      item.dataset.step = step.id;

      item.dataset.foundLabel = step.foundLabel;

      item.innerHTML = `
          <span class="step-number">
            ${index + 1}
          </span>

          <div class="step-copy">

            <strong class="step-title">
              Clue ${index + 1}
            </strong>

            <small class="step-status">
              ${index === 0 ? "In progress" : "Locked"}
            </small>

          </div>
        `;

      this.progressList.appendChild(item);
    });
  }

  // =========================================================
  // CURRENT CLUE
  // =========================================================

  renderClue(step, currentIndex, totalSteps) {
    this.clueProgress.textContent = `CLUE ${currentIndex + 1} OF ${totalSteps}`;

    const hasAudio = step.clueType === "audio" && Boolean(step.audioFile);

    // =====================================================
    // AUDIO CLUE
    //
    // Do not reveal Sanskrit answer.
    // Show only hint + small replay icon.
    // =====================================================

    if (hasAudio) {
      this.sanskritWord.textContent = "";

      this.sanskritWord.classList.add("audio-word-hidden");

      this.audioClueButton.classList.remove("hidden");

      this.audioClueButton.disabled = false;
    }

    // =====================================================
    // NORMAL TEXT CLUE
    // =====================================================
    else {
      this.sanskritWord.textContent = step.sanskrit || "";

      this.sanskritWord.classList.remove("audio-word-hidden");

      this.audioClueButton.classList.add("hidden");

      this.audioClueButton.disabled = true;
    }

    this.englishClue.textContent = step.hint || "";

    this.feedback.textContent = "";
  }

  // =========================================================
  // UPDATE PROGRESS
  // =========================================================

  updateProgress(currentIndex, finished = false) {
    const progressSteps = this.progressList.querySelectorAll(".step");

    const total = progressSteps.length;

    progressSteps.forEach((step, index) => {
      step.classList.remove("active", "locked", "complete");

      const title = step.querySelector(".step-title");

      const status = step.querySelector(".step-status");

      const foundLabel = step.dataset.foundLabel;

      // -----------------------------
      // LEVEL FINISHED
      // -----------------------------

      if (finished) {
        step.classList.add("complete");

        title.textContent = foundLabel;

        status.textContent = "Found";

        return;
      }

      // -----------------------------
      // COMPLETED STEP
      // -----------------------------

      if (index < currentIndex) {
        step.classList.add("complete");

        title.textContent = foundLabel;

        status.textContent = "Found";
      }

      // -----------------------------
      // CURRENT STEP
      // -----------------------------
      else if (index === currentIndex) {
        step.classList.add("active");

        title.textContent = `Clue ${index + 1}`;

        status.textContent = "In progress";
      }

      // -----------------------------
      // FUTURE STEP
      // -----------------------------
      else {
        step.classList.add("locked");

        title.textContent = `Clue ${index + 1}`;

        status.textContent = "Locked";
      }
    });

    this.progressCounter.textContent = finished
      ? `${total} / ${total}`
      : `${currentIndex + 1} / ${total}`;
  }

  // =========================================================
  // RESPONSIVE ROOM SIZE
  // =========================================================

  fitRoom() {
    const desktop = window.matchMedia("(min-width: 1025px)").matches;

    // Tablet / mobile
    if (!desktop) {
      this.roomPanel.style.width = "100%";

      this.roomPanel.style.height = "auto";

      return;
    }

    const availableWidth = this.roomStage.clientWidth;

    const availableHeight = this.roomStage.clientHeight;

    if (availableWidth <= 0 || availableHeight <= 0) {
      return;
    }

    const ratio = this.roomWidth / this.roomHeight;

    let width = availableWidth;

    let height = width / ratio;

    // Prevent vertical overflow.
    if (height > availableHeight) {
      height = availableHeight;

      width = height * ratio;
    }

    this.roomPanel.style.width = `${Math.floor(width)}px`;

    this.roomPanel.style.height = `${Math.floor(height)}px`;
  }

  startResponsiveRoom() {
    this.fitRoom();

    // Remove old observer.
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    if ("ResizeObserver" in window) {
      this.resizeObserver = new ResizeObserver(() => this.fitRoom());

      this.resizeObserver.observe(this.roomStage);
    }

    // Avoid stacking duplicate listeners.
    window.removeEventListener("resize", this.windowResizeHandler);

    window.addEventListener("resize", this.windowResizeHandler);
  }

  // =========================================================
  // FEEDBACK
  // =========================================================

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

  // =========================================================
  // ROOM INTERACTIONS
  // =========================================================

  bindRoomInteraction(objectHandler, emptyHandler) {
    this.roomMap.addEventListener("click", (event) => {
      const hotspot = event.target.closest(".hotspot");

      if (hotspot) {
        objectHandler(hotspot.dataset.object, hotspot);

        return;
      }

      emptyHandler();
    });

    // Keyboard accessibility.
    this.roomMap.addEventListener("keydown", (event) => {
      const hotspot = event.target.closest(".hotspot");

      if (!hotspot) return;

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();

        objectHandler(hotspot.dataset.object, hotspot);
      }
    });
  }

  // =========================================================
  // AUDIO INTERACTION
  // =========================================================

  bindAudioClue(handler) {
    this.audioClueButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      handler();
    });
  }

  // =========================================================
  // STORY POPUP
  // =========================================================

  showStoryPopup(step, isLastStep) {
    this.popupTitle.textContent = step.title;

    this.popupMessage.textContent = step.story;

    this.continueButton.textContent = isLastStep
      ? "Complete Level"
      : "Continue";

    this.homeButton.classList.add("hidden");

    this.popup.classList.remove("hidden");

    this.continueButton.focus();
  }

  hideStoryPopup() {
    this.popup.classList.add("hidden");
  }

  bindContinue(handler) {
    this.continueButton.addEventListener("click", handler);
  }

  // =========================================================
  // LEVEL COMPLETE
  // =========================================================

  showFinished(completion) {
    this.clueProgress.textContent = "LEVEL COMPLETE";

    // Make Sanskrit heading visible again,
    // even if final clue was an audio clue.
    this.sanskritWord.classList.remove("audio-word-hidden");

    this.sanskritWord.textContent = completion.sanskrit || "उत्तमम्!";

    this.englishClue.textContent =
      completion.message || "You escaped the room!";

    // No replay icon after level completion.
    this.audioClueButton.classList.add("hidden");

    this.audioClueButton.disabled = true;

    this.feedback.textContent = "";
  }

  // =========================================================
  // LEVEL COMPLETE POPUP
  // =========================================================

  showLevelComplete(completion, nextLevel) {
    this.popupTitle.textContent = completion.title || "Level Complete! 🎉";

    this.popupMessage.textContent =
      completion.message || "Great work! You completed this level.";

    if (nextLevel) {
      this.continueButton.textContent = `Next Level — ${nextLevel.title}`;
    } else {
      this.continueButton.textContent = "Return Home";
    }

    this.homeButton.classList.toggle("hidden", !nextLevel);

    this.popup.classList.remove("hidden");

    this.continueButton.focus();
  }

  bindHome(handler) {
    this.homeButton.addEventListener("click", handler);
  }

  // =========================================================
  // LOAD ERROR
  // =========================================================

  showLoadError() {
    this.loadError.classList.remove("hidden");
  }
}
