(function () {
  const App = window.GameApp;
  const userModel = new App.UserModel(window.localStorage);
  const progressModel = new App.ProgressModel(window.localStorage);
  const user = userModel.getCurrentUser();

  document.getElementById('playerName').textContent = user ? user.displayName : 'Guest';

  document.getElementById('completeDemoButton').addEventListener('click', () => {
    const progress = progressModel.completeLevel(user, 1, 100, 3);
    const saveText = user ? 'Progress saved.' : 'Guest progress is only kept for this page session.';
    document.getElementById('demoMessage').textContent = `Demo complete: +100 points, +3 stars. Level ${progress.unlockedLevel} unlocked. ${saveText}`;
  });
})();
