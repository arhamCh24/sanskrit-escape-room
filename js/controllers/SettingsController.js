(function () {
  window.GameApp = window.GameApp || {};

  class SettingsController {
    constructor(settingsModel, settingsView) {
      this.model = settingsModel;
      this.view = settingsView;
      this.bindEvents();
      this.apply(this.model.getSettings());
    }

    bindEvents() {
      document.getElementById('settingsButton').addEventListener('click', () => {
        this.view.open(this.model.getSettings());
      });

      document.getElementById('saveSettingsButton').addEventListener('click', () => {
        const settings = this.model.saveSettings(this.view.read());
        this.apply(settings);
        this.view.showSaved();
      });
    }

    apply(settings) {
      document.body.classList.toggle('reduce-motion', settings.reducedMotion);
    }
  }

  window.GameApp.SettingsController = SettingsController;
})();
