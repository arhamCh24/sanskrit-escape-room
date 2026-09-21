import GameModel from "./models/GameModel.js";
import GameView from "./views/GameView.js";
import GameController from "./controllers/GameController.js";
import { loadLevel } from "./LevelLoader.js";
import { getZatamUser } from "../../shared/js/ZatamSession.js";
import { createProgressStore } from "../../shared/js/ProgressStore.js";
import { createSettingsStore } from "../../shared/js/SettingsStore.js";
import { mountAppHeader } from "../../shared/js/AppHeader.js";
import levels from "../../levels/manifest.js";

const params = new URLSearchParams(window.location.search);
const levelNumber = params.get("level") || "1";
const user = getZatamUser();
const levelIds = levels.map(level => level.id);
const progressStore = createProgressStore(user.id, levelIds);
const settingsStore = createSettingsStore(user.id);

const settingsDialog = document.getElementById("settingsDialog");
const soundSetting = document.getElementById("soundSetting");
const hintSetting = document.getElementById("hintSetting");

function openSettings() {
  const settings = settingsStore.get();
  soundSetting.checked = settings.soundEnabled;
  hintSetting.checked = settings.showHints;
  settingsDialog.showModal();
}

mountAppHeader({
  container: document.getElementById("appHeader"),
  user,
  gameHomeHref: "../index.html",
  showGameHomeButton: true,
  settingsStore,
  onOpenSettings: openSettings
});

soundSetting.addEventListener("change", () => settingsStore.update({ soundEnabled: soundSetting.checked }));
hintSetting.addEventListener("change", () => {
  settingsStore.update({ showHints: hintSetting.checked });
  document.body.classList.toggle("hide-game-hints", !hintSetting.checked);
});
document.body.classList.toggle("hide-game-hints", !settingsStore.get().showHints);

async function startGame() {
  const view = new GameView();

  try {
    const levelData = await loadLevel(levelNumber);
    const manifestLevel = levels.find(level => level.id === Number(levelData.id));
    const state = progressStore.getSnapshot();

    if (!manifestLevel?.implemented || !state.levels[levelData.id]?.unlocked) {
      window.location.replace("../index.html#levels");
      return;
    }

    progressStore.startLevel(levelData.id);

    const model = new GameModel(levelData);
    new GameController(model, view, {
      onComplete: () => progressStore.completeLevel(levelData.id)
    });
  } catch (error) {
    console.error("Unable to load level:", error);
    view.showLoadError();
  }
}

startGame();
