(function () {
  window.GameApp = window.GameApp || {};

  class MainMenuController {
    constructor(userModel, progressModel, mainMenuView) {
      this.userModel = userModel;
      this.progressModel = progressModel;
      this.view = mainMenuView;
      this.howToPlayModal = document.getElementById('howToPlayModal');
      this.backdrop = document.getElementById('modalBackdrop');
      this.bindEvents();
    }

    bindEvents() {
      document.getElementById('startGameButton').addEventListener('click', () => {
        this.refreshProgress();
        this.view.showLevels();
      });

      document.getElementById('backHomeButton').addEventListener('click', () => this.view.showHome());
      document.getElementById('howToPlayButton').addEventListener('click', () => this.openHowToPlay());

      this.view.levelCards.forEach((card) => {
        card.addEventListener('click', () => this.openLevel(Number(card.dataset.level)));
      });
    }

    refreshProgress() {
      const user = this.userModel.getCurrentUser();
      const progress = this.progressModel.getProgress(user);
      this.view.renderUser(user);
      this.view.renderProgress(progress);
    }

    openHowToPlay() {
      this.howToPlayModal.classList.remove('hidden');
      this.backdrop.classList.remove('hidden');
      this.backdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    openLevel(level) {
      if (level === 1) {
        window.location.href = 'levels/level-1/index.html';
        return;
      }

      const user = this.userModel.getCurrentUser();
      const progress = this.progressModel.getProgress(user);
      if (level <= progress.unlockedLevel) {
        window.alert(`Level ${level} folder is ready for future content.`);
      }
    }
  }

  window.GameApp.MainMenuController = MainMenuController;
})();
