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
   IMPLEMENTED LEVELS

   Only real, playable levels should affect:
   - progress
   - Continue button
   - completed count
   - unlocked count
========================================================= */

const implementedLevels = levels
  .filter((level) => level.implemented)
  .sort((a, b) => a.id - b.id);

/* =========================================================
   LEVEL IDS
========================================================= */

const levelIds = implementedLevels.map((level) => level.id);

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

/* =========================================================
   HERO CTA
========================================================= */

const continueButton = document.getElementById("continueButton");

const continueEyebrow = document.getElementById("continueEyebrow");

const continueLabel = document.getElementById("continueLabel");

/* =========================================================
   HERO STATS
========================================================= */

const completedStat = document.getElementById("completedStat");

const unlockedStat = document.getElementById("unlockedStat");

const attemptStat = document.getElementById("attemptStat");

/* =========================================================
   PROGRESS
========================================================= */

const progressTitle = document.getElementById("progressTitle");

const progressMessage = document.getElementById("progressMessage");

const progressPercent = document.getElementById("progressPercent");

const progressBar = document.getElementById("progressBar");

const progressTrack = document.querySelector(".progress-track");

/* =========================================================
   LEVEL GRID
========================================================= */

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
   GET SAVED LEVEL DATA

   Supports both:

   levels["1"]

   and

   levels[1]
========================================================= */

function getSavedLevelState(state, levelId) {
  return state.levels?.[String(levelId)] || state.levels?.[levelId] || null;
}

/* =========================================================
   GET LEVEL STATE

   IMPORTANT FIX:

   We also derive unlocking from the completion
   of the previous level.

   This means:

   Level 1 complete
          ↓
   Level 2 becomes available

   even if an older saved progress object still
   says Level 2 unlocked: false.
========================================================= */

function getLevelState(state, level, index) {
  const saved = getSavedLevelState(state, level.id);

  const defaultState = {
    unlocked: false,

    completed: false,

    attempts: 0,

    bestScore: 0,

    bestTimeSeconds: null,
  };

  const levelState = {
    ...defaultState,

    ...(saved || {}),
  };

  /* =======================================================
     FIRST LEVEL IS ALWAYS UNLOCKED
  ======================================================= */

  if (index === 0) {
    levelState.unlocked = true;
  }

  /* =======================================================
     COMPLETED LEVELS REMAIN UNLOCKED
  ======================================================= */

  if (levelState.completed) {
    levelState.unlocked = true;
  }

  /* =======================================================
     UNLOCK NEXT LEVEL WHEN PREVIOUS LEVEL IS COMPLETE
  ======================================================= */

  if (index > 0 && !levelState.unlocked) {
    const previousLevel = implementedLevels[index - 1];

    const previousState = getSavedLevelState(state, previousLevel.id);

    if (previousState?.completed) {
      levelState.unlocked = true;
    }
  }

  return levelState;
}

/* =========================================================
   GET NEXT INCOMPLETE LEVEL

   IMPORTANT:

   DO NOT use progress.currentLevel
   to choose the homepage Continue button.

   Instead find the FIRST implemented level
   that has not been completed.

   Example:

   Level 1 = completed
   Level 2 = not completed

   Result:
   The Missing Ticket
========================================================= */

function getNextIncompleteLevel(levelList, progress) {
  const playableLevels = levelList
    .filter((level) => level.implemented)
    .sort((a, b) => a.id - b.id);

  return (
    playableLevels.find((level) => {
      const levelProgress = getSavedLevelState(progress, level.id);

      return !levelProgress?.completed;
    }) || null
  );
}

/* =========================================================
   COMPLETED LEVEL COUNT
========================================================= */

function getCompletedCount(progress) {
  return implementedLevels.filter((level) => {
    const levelProgress = getSavedLevelState(progress, level.id);

    return Boolean(levelProgress?.completed);
  }).length;
}

/* =========================================================
   ADVENTURE SUMMARY
========================================================= */

function calculateSummary(state) {
  let roomsEscaped = 0;

  let levelsUnlocked = 0;

  let totalAttempts = 0;

  implementedLevels.forEach((level, index) => {
    const levelState = getLevelState(state, level, index);

    if (levelState.unlocked) {
      levelsUnlocked++;
    }

    if (levelState.completed) {
      roomsEscaped++;
    }

    totalAttempts += Number(levelState.attempts) || 0;
  });

  const totalLevels = implementedLevels.length;

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

  /* =======================================================
     FIND THE FIRST UNFINISHED IMPLEMENTED LEVEL
  ======================================================= */

  const nextLevel = getNextIncompleteLevel(implementedLevels, state);

  const completedCount = getCompletedCount(state);

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
    progressTrack.setAttribute(
      "aria-valuenow",

      String(summary.percentage),
    );
  }

  /* =======================================================
     NO IMPLEMENTED LEVELS
  ======================================================= */

  if (implementedLevels.length === 0) {
    continueButton.href = "#levels";

    continueEyebrow.textContent = "COMING SOON";

    continueLabel.textContent = "More Adventures Ahead";

    progressTitle.textContent = "More adventures are coming.";

    progressMessage.textContent =
      "New Sanskrit Escape Room challenges will appear here as they are created.";

    return;
  }

  /* =======================================================
     THERE IS AN UNFINISHED LEVEL
  ======================================================= */

  if (nextLevel) {
    const nextLevelIndex = implementedLevels.findIndex(
      (level) => level.id === nextLevel.id,
    );

    const nextLevelState = getLevelState(state, nextLevel, nextLevelIndex);

    /*
      IMPORTANT:

      We update the EXISTING children:

      continueEyebrow
      continueLabel

      We DO NOT use:

      continueButton.textContent

      because that would destroy the existing
      button layout.
    */

    continueButton.href = nextLevel.href;

    /* =====================================================
       BEFORE LEVEL 1

       Brand-new player.
    ===================================================== */

    if (completedCount === 0 && (Number(nextLevelState.attempts) || 0) === 0) {
      continueEyebrow.textContent = "START ADVENTURE";

      continueLabel.textContent = "Start Adventure";

      progressTitle.textContent = "Ready for your first escape?";

      progressMessage.textContent = `Start with ${nextLevel.title} and follow the first Sanskrit clue.`;

      return;
    }

    /* =====================================================
       LEVEL STARTED BUT NOT COMPLETED

       Example:
       Player exits Level 1 halfway through.
    ===================================================== */

    if (completedCount === 0 && (Number(nextLevelState.attempts) || 0) > 0) {
      continueEyebrow.textContent = "CONTINUE ADVENTURE";

      continueLabel.textContent = `Continue: ${nextLevel.title}`;

      progressTitle.textContent = `Continue ${nextLevel.title}`;

      progressMessage.textContent =
        "Your Escape Room progress is saved for this zat.am player on this device.";

      return;
    }

    /* =====================================================
       PREVIOUS LEVEL COMPLETED

       Example:

       Level 1 complete
       Level 2 incomplete

       Hero now says:

       CONTINUE ADVENTURE
       Continue: The Missing Ticket
    ===================================================== */

    continueEyebrow.textContent = "CONTINUE ADVENTURE";

    continueLabel.textContent = `Continue: ${nextLevel.title}`;

    progressTitle.textContent = `${nextLevel.title} is unlocked!`;

    progressMessage.textContent =
      "Your next Sanskrit Escape Room challenge is ready.";

    return;
  }

  /* =======================================================
     ALL IMPLEMENTED LEVELS COMPLETED

     Example:

     Level 1 ✅
     Level 2 ✅

     Hero:

     PLAY AGAIN
     Replay Adventure
  ======================================================= */

  const firstLevel = implementedLevels[0];

  continueEyebrow.textContent = "PLAY AGAIN";

  continueLabel.textContent = "Replay Adventure";

  continueButton.href = firstLevel?.href || "game/game.html?level=1";

  progressTitle.textContent =
    summary.roomsEscaped === 1
      ? "You escaped the available room!"
      : "You escaped every available room!";

  progressMessage.textContent =
    "Replay an adventure anytime while new Sanskrit challenges are being created.";
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

  const cards = implementedLevels.map((level, index) => {
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
