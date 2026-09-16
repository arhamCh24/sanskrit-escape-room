(function () {
  window.GameApp = window.GameApp || {};

  class MainMenuView {
    constructor() {
      this.homeScreen = document.getElementById('homeScreen');
      this.levelScreen = document.getElementById('levelScreen');
      this.userStatus = document.getElementById('userStatus');
      this.loginButton = document.getElementById('loginButton');
      this.logoutButton = document.getElementById('logoutButton');
      this.guestWarning = document.getElementById('guestWarning');
      this.progressSummary = document.getElementById('progressSummary');
      this.levelCards = Array.from(document.querySelectorAll('.level-card'));
    }

    showHome() {
      this.homeScreen.classList.remove('hidden');
      this.levelScreen.classList.add('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    showLevels() {
      this.homeScreen.classList.add('hidden');
      this.levelScreen.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    renderUser(user) {
      const loggedIn = Boolean(user);
      this.userStatus.textContent = loggedIn ? `Welcome, ${user.displayName}` : 'Playing as Guest';
      this.loginButton.classList.toggle('hidden', loggedIn);
      this.logoutButton.classList.toggle('hidden', !loggedIn);
      this.guestWarning.classList.toggle('hidden', loggedIn);
    }

    renderProgress(progress) {
      const unlockedLevel = Math.max(1, Number(progress.unlockedLevel) || 1);
      this.progressSummary.textContent = `Score: ${progress.score} • Stars: ${progress.stars} • Level ${unlockedLevel} unlocked`;

      this.levelCards.forEach((card) => {
        const level = Number(card.dataset.level);
        const isUnlocked = level <= unlockedLevel;
        card.disabled = !isUnlocked;
        card.classList.toggle('locked', !isUnlocked);
        const state = card.querySelector('.level-state');
        state.textContent = isUnlocked ? 'Unlocked' : '🔒 Locked';
      });
    }
  }

  window.GameApp.MainMenuView = MainMenuView;
})();
