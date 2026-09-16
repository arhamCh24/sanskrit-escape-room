(function () {
  window.GameApp = window.GameApp || {};

  class ProgressModel {
    constructor(storage) {
      this.storage = storage;
      this.guestProgress = this.createDefaultProgress();
    }

    createDefaultProgress() {
      return {
        unlockedLevel: 1,
        score: 0,
        stars: 0,
        completedLevels: [],
        updatedAt: null
      };
    }

    getKey(username) {
      return `ser_progress_v1_${String(username).toLowerCase()}`;
    }

    getProgress(user) {
      if (!user) return { ...this.guestProgress };

      try {
        const saved = JSON.parse(this.storage.getItem(this.getKey(user.username)));
        return { ...this.createDefaultProgress(), ...(saved || {}) };
      } catch (_error) {
        return this.createDefaultProgress();
      }
    }

    saveProgress(user, progress) {
      const safeProgress = {
        ...this.createDefaultProgress(),
        ...progress,
        updatedAt: new Date().toISOString()
      };

      if (!user) {
        this.guestProgress = safeProgress;
        return safeProgress;
      }

      this.storage.setItem(this.getKey(user.username), JSON.stringify(safeProgress));
      return safeProgress;
    }

    completeLevel(user, levelNumber, scoreEarned, starsEarned) {
      const progress = this.getProgress(user);
      const completed = new Set(progress.completedLevels || []);
      completed.add(levelNumber);

      progress.completedLevels = Array.from(completed).sort((a, b) => a - b);
      progress.unlockedLevel = Math.max(progress.unlockedLevel, levelNumber + 1);
      progress.score += Number(scoreEarned) || 0;
      progress.stars += Number(starsEarned) || 0;

      return this.saveProgress(user, progress);
    }
  }

  window.GameApp.ProgressModel = ProgressModel;
})();
