(function () {
  window.GameApp = window.GameApp || {};

  class SettingsView {
    constructor() {
      this.modal = document.getElementById('settingsModal');
      this.backdrop = document.getElementById('modalBackdrop');
      this.sound = document.getElementById('soundSetting');
      this.motion = document.getElementById('motionSetting');
      this.message = document.getElementById('settingsMessage');
    }

    open(settings) {
      this.sound.checked = settings.sound;
      this.motion.checked = settings.reducedMotion;
      this.message.textContent = '';
      this.modal.classList.remove('hidden');
      this.backdrop.classList.remove('hidden');
      this.backdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    close() {
      this.modal.classList.add('hidden');
      this.backdrop.classList.add('hidden');
      this.backdrop.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    read() {
      return { sound: this.sound.checked, reducedMotion: this.motion.checked };
    }

    showSaved() {
      this.message.textContent = 'Settings saved.';
      this.message.className = 'form-message success';
    }
  }

  window.GameApp.SettingsView = SettingsView;
})();
