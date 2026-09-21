/* =========================================================
   SANSKRIT ESCAPE ROOM
   HOME PAGE CONTROLLER
========================================================= */

/* =========================================================
   IMPORTS
========================================================= */

import levels from "../../levels/manifest.js";

import { getZatamUser } from "../../shared/js/ZatamSession.js";

import { createProgressStore } from "../../shared/js/ProgressStore.js";

import { createSettingsStore } from "../../shared/js/SettingsStore.js";

import { mountAppHeader } from "../../shared/js/AppHeader.js";

/* =========================================================
   ZAT.AM USER
========================================================= */

const user = getZatamUser();

/* =========================================================
   LEVEL IDS

   Because manifest.js contains ONLY real levels,
   our ProgressStore also only tracks real levels.
========================================================= */

const levelIds = levels.map((level) => level.id);

/* =========================================================
   STORES
========================================================= */

const progressStore = createProgressStore(user.id, levelIds);

const settingsStore = createSettingsStore(user.id);

/* =========================================================
   DOM ELEMENTS
========================================================= */

const appHeader = document.getElementById("appHeader");

const howToPlayButton = document.getElementById("howToPlayButton");

const howToPlayDialog = document.getElementById("howToPlayDialog");

const settingsDialog = document.getElementById("settingsDialog");

const soundSetting = document.getElementById("soundSetting");

const hintSetting = document.getElementById("hintSetting");

const resetProgressButton = document.getElementById("resetProgressButton");

/* HERO CTA */

const continueButton = document.getElementById("continueButton");

const continueEyebrow = document.getElementById("continueEyebrow");

const continueLabel = document.getElementById("continueLabel");

/* HERO STATS */

const completedStat = document.getElementById("completedStat");

const unlockedStat = document.getElementById("unlockedStat");

const attemptStat = document.getElementById("attemptStat");

/* PROGRESS */

const progressTitle = document.getElementById("progressTitle");

const progressMessage = document.getElementById("progressMessage");

const progressPercent = document.getElementById("progressPercent");

const progressBar = document.getElementById("progressBar");

const progressTrack = document.querySelector(".progress-track");

/* LEVEL GRID */

const levelGrid = document.getElementById("levelGrid");

/* =========================================================
   SHARED HEADER
========================================================= */

mountAppHeader({
  container: appHeader,

  user,

  gameHomeHref: "./index.html",

  /*
    We are already on the Escape Room home page,
    so don't show another Escape Room home button.
  */

  showGameHomeButton: false,

  settingsStore,

  onOpenSettings: () => {
    openSettings();
  },
});

/* =========================================================
   HELPERS
========================================================= */

function getProgressSnapshot() {
  return progressStore.getSnapshot();
}

function pluralize(amount, singular, plural) {
  return amount === 1 ? singular : plural;
}

/* =========================================================
   GET LEVEL STATE

   Protects us if a new level is added to manifest.js
   before the user's local progress structure is updated.
========================================================= */

function getLevelState(state, level, index) {
  const saved = state.levels?.[level.id];

  /*
    First actual game level should always be accessible.
  */

  if (index === 0 && !saved) {
    return {
      unlocked: true,

      completed: false,

      attempts: 0,

      bestScore: 0,

      bestTimeSeconds: null,
    };
  }

  return (
    saved || {
      unlocked: false,

      completed: false,

      attempts: 0,

      bestScore: 0,

      bestTimeSeconds: null,
    }
  );
}

/* =========================================================
   ADVENTURE SUMMARY
========================================================= */

function calculateSummary(state) {
  let roomsEscaped = 0;

  let levelsUnlocked = 0;

  let totalAttempts = 0;

  levels.forEach((level, index) => {
    const levelState = getLevelState(state, level, index);

    if (levelState.unlocked) {
      levelsUnlocked++;
    }

    if (levelState.completed) {
      roomsEscaped++;
    }

    totalAttempts += Number(levelState.attempts) || 0;
  });

  const totalLevels = levels.length;

  const percentage =
    totalLevels > 0 ? Math.round((roomsEscaped / totalLevels) * 100) : 0;

  return {
    roomsEscaped,

    levelsUnlocked,

    totalAttempts,

    totalLevels,

    percentage,
  };
}

/* =========================================================
   FIND NEXT LEVEL TO PLAY
========================================================= */

function findCurrentAdventure(state) {
  /*
    First look for an unlocked level
    that is not complete.
  */

  for (let index = 0; index < levels.length; index++) {
    const level = levels[index];

    const levelState = getLevelState(state, level, index);

    if (levelState.unlocked && !levelState.completed) {
      return {
        level,

        levelState,

        index,
      };
    }
  }

  /*
    If all currently available levels are complete,
    replay the highest unlocked real level.
  */

  for (let index = levels.length - 1; index >= 0; index--) {
    const level = levels[index];

    const levelState = getLevelState(state, level, index);

    if (levelState.unlocked) {
      return {
        level,

        levelState,

        index,
      };
    }
  }

  /*
    Ultimate fallback.
  */

  if (levels.length > 0) {
    return {
      level: levels[0],

      levelState: getLevelState(state, levels[0], 0),

      index: 0,
    };
  }

  return null;
}

/* =========================================================
   UPDATE STAT LABELS
========================================================= */

function renderStatLabels(summary) {
  const statBlocks = document.querySelectorAll(".quick-stats > div");

  if (statBlocks.length < 3) {
    return;
  }

  const escapedLabel = statBlocks[0].querySelector("span");

  const unlockedLabel = statBlocks[1].querySelector("span");

  const attemptLabel = statBlocks[2].querySelector("span");

  escapedLabel.textContent = pluralize(
    summary.roomsEscaped,
    "Room escaped",
    "Rooms escaped",
  );

  unlockedLabel.textContent = pluralize(
    summary.levelsUnlocked,
    "Level unlocked",
    "Levels unlocked",
  );

  attemptLabel.textContent = pluralize(
    summary.totalAttempts,
    "Attempt",
    "Attempts",
  );
}

/* =========================================================
   RENDER HERO + PROGRESS
========================================================= */

function renderSummary() {
  const state = getProgressSnapshot();

  const summary = calculateSummary(state);

  const adventure = findCurrentAdventure(state);

  /* =======================================================
     STATS
  ======================================================= */

  completedStat.textContent = String(summary.roomsEscaped);

  unlockedStat.textContent = String(summary.levelsUnlocked);

  attemptStat.textContent = String(summary.totalAttempts);

  renderStatLabels(summary);

  /* =======================================================
     PROGRESS BAR
  ======================================================= */

  progressPercent.textContent = `${summary.percentage}%`;

  progressBar.style.width = `${summary.percentage}%`;

  if (progressTrack) {
    progressTrack.setAttribute("aria-valuenow", String(summary.percentage));
  }

  /* =======================================================
     NO REAL LEVELS YET

     Defensive fallback.
  ======================================================= */

  if (!adventure) {
    continueButton.href = "#levels";

    continueEyebrow.textContent = "COMING SOON";

    continueLabel.textContent = "More Adventures Ahead";

    progressTitle.textContent = "More adventures are coming.";

    progressMessage.textContent =
      "New Sanskrit Escape Room challenges will appear here as they are created.";

    return;
  }

  const { level, levelState } = adventure;

  continueButton.href = level.href;

  /* =======================================================
     ALL CURRENT LEVELS COMPLETE
  ======================================================= */

  if (summary.roomsEscaped === summary.totalLevels) {
    continueEyebrow.textContent = "PLAY AGAIN";

    continueLabel.textContent = `Replay ${level.title}`;

    progressTitle.textContent =
      summary.roomsEscaped === 1
        ? "You escaped the available room!"
        : "You escaped every available room!";

    progressMessage.textContent =
      "Replay an adventure anytime while new Sanskrit challenges are being created.";

    return;
  }

  /* =======================================================
     CURRENT LEVEL IN PROGRESS
  ======================================================= */

  if ((Number(levelState.attempts) || 0) > 0) {
    continueEyebrow.textContent = "CONTINUE ADVENTURE";

    continueLabel.textContent = `Continue ${level.title}`;

    progressTitle.textContent = `Continue ${level.title}`;

    progressMessage.textContent =
      "Your Escape Room progress is saved for this zat.am player on this device.";

    return;
  }

  /* =======================================================
     BRAND NEW PLAYER / NEW UNLOCKED LEVEL
  ======================================================= */

  continueEyebrow.textContent =
    summary.roomsEscaped > 0 ? "NEXT ADVENTURE" : "START ADVENTURE";

  continueLabel.textContent =
    summary.roomsEscaped > 0 ? `Play ${level.title}` : "Begin Your Journey";

  progressTitle.textContent =
    summary.roomsEscaped > 0
      ? `${level.title} is unlocked!`
      : "Ready for your first escape?";

  progressMessage.textContent =
    summary.roomsEscaped > 0
      ? "A new Sanskrit Escape Room challenge is ready."
      : `Start with ${level.title} and follow the first Sanskrit clue.`;
}

/* =========================================================
   REAL LEVEL CARD
========================================================= */

function createLevelCard(level, state, index) {
  const levelState = getLevelState(state, level, index);

  const playable = Boolean(levelState.unlocked);

  const completed = Boolean(levelState.completed);

  const card = document.createElement("article");

  card.className = `level-card ${playable ? "is-playable" : "is-locked"}`;

  /* =======================================================
     STATUS
  ======================================================= */

  let status;

  let imageStatus;

  if (completed) {
    status = "Completed";

    imageStatus = "COMPLETED";
  } else if (playable && Number(levelState.attempts) > 0) {
    status = "In Progress";

    imageStatus = "IN PROGRESS";
  } else if (playable) {
    status = "Unlocked";

    imageStatus = "PLAYABLE";
  } else {
    status = "Locked";

    imageStatus = "LOCKED";
  }

  /* =======================================================
     ACTION
  ======================================================= */

  let action;

  if (playable) {
    let actionText;

    if (completed) {
      actionText = "Replay";
    } else if (Number(levelState.attempts) > 0) {
      actionText = "Continue";
    } else {
      actionText = "Play Now";
    }

    action = `

      <a
        class="level-action"
        href="${level.href}"
      >
        ${actionText} ▶
      </a>

    `;
  } else {
    action = `

      <span
        class="level-action disabled"
      >
        Locked
      </span>

    `;
  }

  /* =======================================================
     CARD HTML
  ======================================================= */

  card.innerHTML = `

    <div class="level-image">


      <img
        src="${level.image}"
        alt=""
      >


      <span class="level-status-pill">

        ${imageStatus}

      </span>


    </div>



    <div class="level-body">


      <div class="level-meta">


        <span>
          LEVEL ${level.id}
        </span>


        <strong
          class="${completed ? "is-complete" : ""}"
        >
          ${status}
        </strong>


      </div>



      <h3>
        ${level.title}
      </h3>



      <p>
        ${level.description}
      </p>



      <div class="level-footer">


        <span>
          ${level.difficulty}
        </span>


        ${action}


      </div>


    </div>

  `;

  return card;
}

/* =========================================================
   GENERIC FUTURE ADVENTURES CARD

   IMPORTANT:
   This is NOT Level 2 or Level 3.

   It simply tells the player that the game will grow.
========================================================= */

function createFutureAdventureCard() {
  const card = document.createElement("article");

  card.className = "future-adventure-card";

  card.innerHTML = `

    <div class="future-visual">


      <div
        class="future-map"
        aria-hidden="true"
      >


        <span class="future-node node-one"></span>

        <span class="future-path path-one"></span>


        <span class="future-node node-two"></span>

        <span class="future-path path-two"></span>


        <span class="future-node node-three"></span>

        <span class="future-path path-three"></span>


        <span class="future-node node-four"></span>


        <div class="future-lock">
          🔐
        </div>


      </div>



      <span class="future-pill">
        MORE TO COME
      </span>


    </div>



    <div class="future-content">


      <span class="future-eyebrow">
        THE ADVENTURE CONTINUES
      </span>


      <h3>
        More Adventures Ahead
      </h3>


      <p>

        New rooms, Sanskrit clues, puzzles and challenges
        will continue to expand the Escape Room world.

      </p>



      <div class="future-features">


        <span>
          🔊 Audio clues
        </span>


        <span>
          🧩 New puzzles
        </span>


        <span>
          ⏱️ New challenges
        </span>


      </div>


      <div class="future-footer">


        <span>
          Keep exploring
        </span>


        <strong>
          Coming Soon
        </strong>


      </div>


    </div>

  `;

  return card;
}

/* =========================================================
   RENDER LEVEL GRID
========================================================= */

function renderLevels() {
  const state = getProgressSnapshot();

  const cards = levels.map((level, index) => {
    return createLevelCard(level, state, index);
  });

  /*
    Always finish with ONE generic future card.
  */

  cards.push(createFutureAdventureCard());

  levelGrid.replaceChildren(...cards);
}

/* =========================================================
   SETTINGS
========================================================= */

function openSettings() {
  const settings = settingsStore.get();

  soundSetting.checked = Boolean(settings.soundEnabled);

  hintSetting.checked = Boolean(settings.showHints);

  if (typeof settingsDialog.showModal === "function") {
    settingsDialog.showModal();
  } else {
    settingsDialog.setAttribute("open", "");
  }
}

/* =========================================================
   HEADER SOUND VISUAL
========================================================= */

function updateHeaderSoundState() {
  const soundButton = document.querySelector(".sound-toggle");

  if (!soundButton) {
    return;
  }

  const settings = settingsStore.get();

  const muted = !settings.soundEnabled;

  soundButton.classList.toggle("is-muted", muted);

  soundButton.setAttribute("aria-pressed", String(muted));
}

/* =========================================================
   HOW TO PLAY
========================================================= */

howToPlayButton?.addEventListener("click", () => {
  if (typeof howToPlayDialog.showModal === "function") {
    howToPlayDialog.showModal();
  } else {
    howToPlayDialog.setAttribute("open", "");
  }
});

/* =========================================================
   SOUND SETTING
========================================================= */

soundSetting?.addEventListener("change", () => {
  settingsStore.update({
    soundEnabled: soundSetting.checked,
  });

  updateHeaderSoundState();
});

/* =========================================================
   HINT SETTING
========================================================= */

hintSetting?.addEventListener("change", () => {
  settingsStore.update({
    showHints: hintSetting.checked,
  });
});

/* =========================================================
   RESET PROGRESS
========================================================= */

resetProgressButton?.addEventListener("click", () => {
  const confirmed = window.confirm(
    "Reset all Sanskrit Escape Room progress for this player on this device?",
  );

  if (!confirmed) {
    return;
  }

  progressStore.reset();

  if (typeof settingsDialog.close === "function") {
    settingsDialog.close();
  } else {
    settingsDialog.removeAttribute("open");
  }

  refreshHome();
});

/* =========================================================
   REFRESH HOME
========================================================= */

function refreshHome() {
  renderSummary();

  renderLevels();

  updateHeaderSoundState();
}

/* =========================================================
   RETURNING FROM A LEVEL

   Browser back/forward cache may keep index.html alive.
   Refresh progress whenever the page becomes visible again.
========================================================= */

window.addEventListener("pageshow", () => {
  refreshHome();
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    refreshHome();
  }
});

/* =========================================================
   INITIAL RENDER
========================================================= */

refreshHome();
