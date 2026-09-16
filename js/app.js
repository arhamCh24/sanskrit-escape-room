(function () {
  const App = window.GameApp;

  const userModel = new App.UserModel(window.localStorage);
  const progressModel = new App.ProgressModel(window.localStorage);
  const settingsModel = new App.SettingsModel(window.localStorage);

  const authView = new App.AuthView();
  const mainMenuView = new App.MainMenuView();
  const settingsView = new App.SettingsView();

  const authController = new App.AuthController(userModel, progressModel, authView, mainMenuView);
  new App.MainMenuController(userModel, progressModel, mainMenuView);
  new App.SettingsController(settingsModel, settingsView);

  const howToPlayModal = document.getElementById('howToPlayModal');
  const settingsModal = document.getElementById('settingsModal');
  const backdrop = document.getElementById('modalBackdrop');

  function closeAllModals() {
    authView.close();
    settingsView.close();
    howToPlayModal.classList.add('hidden');
    backdrop.classList.add('hidden');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-close-modal]').forEach((button) => {
    button.addEventListener('click', closeAllModals);
  });

  backdrop.addEventListener('click', closeAllModals);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeAllModals();
  });

  authController.refreshUserUI();
})();
