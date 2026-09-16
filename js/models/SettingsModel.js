(function () {
  window.GameApp = window.GameApp || {};

  class SettingsModel {
    constructor(storage) {
      this.storage = storage;
      this.key = 'ser_settings_v1';
      this.defaults = { sound: true, reducedMotion: false };
    }

    getSettings() {
      try {
        return { ...this.defaults, ...(JSON.parse(this.storage.getItem(this.key)) || {}) };
      } catch (_error) {
        return { ...this.defaults };
      }
    }

    saveSettings(settings) {
      const next = {
        sound: Boolean(settings.sound),
        reducedMotion: Boolean(settings.reducedMotion)
      };
      this.storage.setItem(this.key, JSON.stringify(next));
      return next;
    }
  }

  window.GameApp.SettingsModel = SettingsModel;
})();
