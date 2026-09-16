(function () {
  window.GameApp = window.GameApp || {};

  class AuthController {
    constructor(userModel, progressModel, authView, mainMenuView) {
      this.userModel = userModel;
      this.progressModel = progressModel;
      this.authView = authView;
      this.mainMenuView = mainMenuView;
      this.bindEvents();
    }

    bindEvents() {
      document.getElementById('loginButton').addEventListener('click', () => this.authView.open('login'));
      document.getElementById('logoutButton').addEventListener('click', () => this.logout());
      this.authView.loginTab.addEventListener('click', () => this.authView.setMode('login'));
      this.authView.registerTab.addEventListener('click', () => this.authView.setMode('register'));
      this.authView.loginForm.addEventListener('submit', (event) => this.handleLogin(event));
      this.authView.registerForm.addEventListener('submit', (event) => this.handleRegister(event));
    }

    refreshUserUI() {
      const user = this.userModel.getCurrentUser();
      const progress = this.progressModel.getProgress(user);
      this.mainMenuView.renderUser(user);
      this.mainMenuView.renderProgress(progress);
      return user;
    }

    async handleLogin(event) {
      event.preventDefault();
      const form = event.currentTarget;
      const username = document.getElementById('loginUsername').value;
      const password = document.getElementById('loginPassword').value;

      try {
        this.authView.setBusy(form, true);
        const result = await this.userModel.login(username, password);
        if (!result.ok) {
          this.authView.showMessage(result.message);
          return;
        }
        this.authView.showMessage('Login successful.', 'success');
        this.refreshUserUI();
        window.setTimeout(() => this.authView.close(), 450);
      } catch (error) {
        this.authView.showMessage(error.message || 'Unable to log in.');
      } finally {
        this.authView.setBusy(form, false);
      }
    }

    async handleRegister(event) {
      event.preventDefault();
      const form = event.currentTarget;
      const username = document.getElementById('registerUsername').value;
      const password = document.getElementById('registerPassword').value;
      const confirm = document.getElementById('registerPasswordConfirm').value;

      if (password !== confirm) {
        this.authView.showMessage('Passwords do not match.');
        return;
      }

      try {
        this.authView.setBusy(form, true);
        const result = await this.userModel.register(username, password);
        if (!result.ok) {
          this.authView.showMessage(result.message);
          return;
        }
        this.authView.showMessage('Account created. Your progress can now be saved.', 'success');
        this.refreshUserUI();
        window.setTimeout(() => this.authView.close(), 650);
      } catch (error) {
        this.authView.showMessage(error.message || 'Unable to create the account.');
      } finally {
        this.authView.setBusy(form, false);
      }
    }

    logout() {
      this.userModel.logout();
      this.refreshUserUI();
      this.mainMenuView.showHome();
    }
  }

  window.GameApp.AuthController = AuthController;
})();
