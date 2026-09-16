# Sanskrit Escape Room - Starter Prototype

A simple browser-based starter for the Sanskrit Escape Room concept using only HTML, CSS, and client-side JavaScript.

## What is included

- Kid-friendly main screen
- Start Game / level selection
- Login and register prototype
- Login session remembered with localStorage
- Per-user progress stored with localStorage
- Settings stored with localStorage
- How to Play modal
- MVC-inspired folder structure
- Separate folder for each level
- Level 1 placeholder with a demo progress-save button
- Level 2 and Level 3 folders ready for future work

## Run it

For reliable Web Crypto + localStorage behavior, run the project through localhost instead of opening the HTML file directly.

### Option 1 - VS Code
Install the **Live Server** extension and open `index.html` with Live Server.

### Option 2 - Node.js
From this folder, run:

```bash
npx serve .
```

Then open the localhost URL printed in the terminal.

## MVC mapping

### Model
`js/models/`

- `UserModel.js` - registration, login session, local prototype accounts
- `ProgressModel.js` - score, stars, unlocked levels
- `SettingsModel.js` - sound and motion preferences

### View
`js/views/`

- `AuthView.js` - login/register modal UI
- `MainMenuView.js` - home and level-selection UI
- `SettingsView.js` - settings UI

### Controller
`js/controllers/`

- `AuthController.js` - connects account forms to UserModel
- `MainMenuController.js` - Start Game, level selection, How to Play
- `SettingsController.js` - connects settings UI to SettingsModel

## Level folders

Each level gets its own folder:

```text
levels/
  level-1/
  level-2/
  level-3/
```

Level-specific assets and logic can stay inside the level folder. Shared systems should remain outside the level folders to avoid copying the same code into every level.

## Important security note

The login feature in this starter is only for a local prototype. The browser hashes the password before storing the prototype account, but client-side localStorage is not a secure replacement for real authentication.

For a production/shared website, use a secure backend or an authentication service such as Firebase Authentication, Supabase Auth, Auth0, etc.
