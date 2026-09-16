(function () {
  window.GameApp = window.GameApp || {};

  class AuthView {
    constructor() {
      this.modal = document.getElementById('authModal');
      this.backdrop = document.getElementById('modalBackdrop');
      this.loginTab = document.getElementById('loginTab');
      this.registerTab = document.getElementById('registerTab');
      this.loginForm = document.getElementById('loginForm');
      this.registerForm = document.getElementById('registerForm');
      this.message = document.getElementById('authMessage');
    }

    open(mode = 'login') {
      this.setMode(mode);
      this.message.textContent = '';
      this.message.className = 'form-message';
      this.modal.classList.remove('hidden');
      this.backdrop.classList.remove('hidden');
      this.backdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      const target = mode === 'register'
        ? document.getElementById('registerUsername')
        : document.getElementById('loginUsername');
      window.setTimeout(() => target.focus(), 0);
    }

    close() {
      this.modal.classList.add('hidden');
      this.backdrop.classList.add('hidden');
      this.backdrop.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      this.loginForm.reset();
      this.registerForm.reset();
      this.message.textContent = '';
    }

    setMode(mode) {
      const loginMode = mode !== 'register';
      this.loginTab.classList.toggle('active', loginMode);
      this.registerTab.classList.toggle('active', !loginMode);
      this.loginTab.setAttribute('aria-selected', String(loginMode));
      this.registerTab.setAttribute('aria-selected', String(!loginMode));
      this.loginForm.classList.toggle('hidden', !loginMode);
      this.registerForm.classList.toggle('hidden', loginMode);
    }

    showMessage(text, type = 'error') {
      this.message.textContent = text;
      this.message.className = `form-message ${type}`;
    }

    setBusy(form, isBusy) {
      Array.from(form.elements).forEach((element) => {
        element.disabled = isBusy;
      });
    }
  }

  window.GameApp.AuthView = AuthView;
})();
