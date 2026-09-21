# Sanskrit Escape Room — Shared Level Engine

This is the refactored project structure so future levels can reuse the same layout and game logic.

## Shared files

Every level uses the same:

- `game/game.html`
- `game/css/game.css`
- `game/js/models/GameModel.js`
- `game/js/views/GameView.js`
- `game/js/controllers/GameController.js`
- `game/js/LevelLoader.js`
- `game/js/game.js`

Each level only needs its own configuration file under `levels/level-N/level.js`.

## Assets

Media is kept separately under `assets/`:

- `assets/images/levels/level-1/background.png`
- `assets/images/levels/level-2/`
- `assets/audio/levels/level-1/`
- `assets/audio/levels/level-2/`
- `assets/icons/`

The included Level 1 config already points to:

`assets/images/levels/level-1/background.png`

## Test Level 1

Run the project through Live Server or another HTTP server, then open:

`game/game.html?level=1`

The included root `index.html` is only a simple test launcher. If your existing project already has a homepage/login/level-selection page, keep it and change the Level 1 link to:

`game/game.html?level=1`

## Old Level 1 files

After this version works, you can remove the old duplicated files:

- `levels/level-1/index.html`
- `levels/level-1/css/level.css`
- old `levels/level-1/js/Level1Model.js`
- old `levels/level-1/js/Level1View.js`
- old `levels/level-1/js/Level1Controller.js`

Keep the new `levels/level-1/level.js` from this package.

## Future difficulty

Each level can define settings such as:

```js
settings: {
  timer: false,
  questions: false,
  audio: false,
  scoring: false,
  randomizeObjects: false
}
```

Starter reusable managers are included in `game/js/features/` for future work:

- `TimerManager.js`
- `AudioManager.js`
- `QuestionManager.js`
- `ScoreManager.js`
- `InventoryManager.js`
- `Randomizer.js`

They are intentionally not connected to Level 1 yet, so Level 1 stays simple.

## Level 2 and later

Create/update only:

- `levels/level-2/level.js`
- `assets/images/levels/level-2/background.png`
- optional audio files under `assets/audio/levels/level-2/`

Then launch it with:

`game/game.html?level=2`

## Important

Use Live Server / GitHub Pages / another HTTP server. Do not open `game.html` with a `file://` URL because ES modules and dynamic imports are used.


## Portal-ready game home

The root `index.html` is now the Sanskrit Escape Room's own game home screen, not a copy of the zat.am portal.

Flow:

`zat.am portal -> Sanskrit Escape Room home -> level -> Escape Room home / portal home`

Portal values used:

- `zatamUserId` — internal progress ownership / future leaderboard integration
- `zatamUserName` — displayed in the game header
- `zatamUserPhoto` — displayed if available
- `zatamLanguage` — available for future localization

Escape Room progress is stored per user in:

`sanskritEscapeRoomProgress:v1:<zatamUserId>`

Settings are stored per user in:

`sanskritEscapeRoomSettings:v1:<zatamUserId>`

Localhost cannot read `localStorage` from `https://zatam2.vercel.app` because localStorage is origin-scoped. Once integrated under the same zat.am origin, the portal account values are available to the game.
