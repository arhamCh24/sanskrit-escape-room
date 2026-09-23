# Sanskrit Escape Room

Sanskrit Escape Room is a web-based educational game where players follow Sanskrit clues, find objects in interactive scenes, and progress through different levels.

Each level has its own room, clue sequence, clickable areas, and optional features such as audio clues.

---

## Project Structure

```text
sanskrit-escape-room/
│
├── index.html
│
├── LEVELS_GUIDE.md
│
├── game/
│   ├── game.html
│   ├── css/
│   │   └── game.css
│   └── js/
│       ├── models/
│       │   └── GameModel.js
│       ├── views/
│       │   └── GameView.js
│       ├── controllers/
│       │   └── GameController.js
│       ├── features/
│       │   ├── AudioManager.js
│       │   ├── TimerManager.js
│       │   ├── QuestionManager.js
│       │   ├── ScoreManager.js
│       │   ├── InventoryManager.js
│       │   └── Randomizer.js
│       ├── LevelLoader.js
│       └── game.js
│
├── levels/
│   ├── manifest.js
│   ├── level-1/
│   │   └── level.js
│   └── level-2/
│       └── level.js
│
├── shared/
│   ├── css/
│   └── js/
│
└── assets/
    ├── images/
    │   ├── home/
    │   └── levels/
    │       ├── level-1/
    │       │   └── background.png
    │       └── level-2/
    │           └── background.png
    │
    ├── audio/
    │   └── levels/
    │       └── level-2/
    │           ├── bag.mp3
    │           └── train.mp3
    │
    └── icons/
```

---

## Running the Project

Run the project using Live Server or another local HTTP server.

Do not open `game.html` directly with a `file://` URL because the project uses JavaScript modules.

Main game homepage:

```text
index.html
```

Levels are opened using the level number in the URL:

```text
game/game.html?level=1
game/game.html?level=2
```

---

## Level Configuration

Each level has its own configuration file:

```text
levels/level-1/level.js
levels/level-2/level.js
```

Level files contain the information specific to that level:

- level name
- mission
- gameplay settings
- background image
- completion message
- clue sequence
- Sanskrit words
- audio clues
- clickable hotspot coordinates

All levels should follow the same structure.

Example:

```js
const level = {
  id: 1,

  gameTitle: "Sanskrit Escape Room",

  roomName: "Level Name",

  mission: "Level mission.",

  tip: "Gameplay tip.",

  settings: {
    timer: false,
    questions: false,
    audio: false,
    scoring: false,
    randomizeObjects: false,
  },

  room: {
    width: 1672,
    height: 941,

    backgroundUrl: new URL(
      "../../assets/images/levels/level-1/background.png",
      import.meta.url,
    ).href,
  },

  completion: {
    title: "Level Complete! 🎉",
    sanskrit: "उत्तमम्!",
    message: "Level completion message.",
  },

  steps: [
    // Clues
  ],

  hotspots: [
    // Clickable areas
  ],
};

export default level;
```

---

## Level Settings

Each level includes the same settings object:

```js
settings: {
  timer: false,
  questions: false,
  audio: false,
  scoring: false,
  randomizeObjects: false,
},
```

Enable a setting only when the level uses that feature.

For example, a level containing audio clues can use:

```js
settings: {
  timer: false,
  questions: false,
  audio: true,
  scoring: false,
  randomizeObjects: false,
},
```

Keeping the same settings structure in every level makes the configuration easier to understand and maintain.

---

## Clue Sequence

The order of objects inside the `steps` array determines the gameplay sequence.

Example:

```js
steps: [
  {
    id: "book",
    ...
  },

  {
    id: "lamp",
    ...
  },

  {
    id: "chair",
    ...
  },
]
```

This creates:

```text
Book → Lamp → Chair
```

To change the clue order, move the complete clue object to a different position in the `steps` array.

---

## Text Clues

A normal text clue uses:

```js
{
  id: "book",

  sanskrit: "पुस्तकम्",

  hint: "Find the green one among the books.",

  foundLabel: "Book",

  title: "You found the book!",

  story:
    "The story text that leads to the next clue.",

  clueType: "text",
},
```

---

## Audio Clues

Audio clues use the same structure with an additional `audioFile`.

```js
{
  id: "bag",

  sanskrit: "स्यूतम्",

  hint: "Listen carefully and find the object you hear.",

  foundLabel: "Bag",

  title: "You found the bag!",

  story:
    "The story text that leads to the next clue.",

  clueType: "audio",

  audioFile: new URL(
    "../../assets/audio/levels/level-2/bag.mp3",
    import.meta.url,
  ).href,
},
```

Audio files are stored inside:

```text
assets/audio/levels/
```

---

## Clickable Hotspots

Clickable objects are defined inside the `hotspots` array.

The `object` value should match the related clue `id`.

Example:

```js
{
  type: "polygon",
  object: "book",
  points:
    "865,414 891,408 899,476 875,489 865,484",
},
```

The clue:

```js
{
  id: "book",
  ...
}
```

matches:

```js
{
  object: "book",
  ...
}
```

---

## Moving a Clickable Area

Hotspot coordinates can be edited directly inside the level file.

For polygons:

```js
{
  type: "polygon",

  object: "book",

  points:
    "865,414 891,408 899,476 875,489 865,484",
},
```

Each coordinate pair represents:

```text
X,Y
```

- smaller X = move left
- larger X = move right
- smaller Y = move up
- larger Y = move down

To move the entire clickable area, adjust all coordinate points by approximately the same amount.

---

## Circle Hotspots

Circular objects can use:

```js
{
  type: "circle",

  object: "clock",

  cx: 648,

  cy: 129,

  r: 84,
},
```

Where:

```text
cx = horizontal position
cy = vertical position
r  = clickable radius
```

---

## Multiple Hotspots for One Object

Large or irregular objects can use multiple hotspot shapes.

Example:

```js
{
  type: "polygon",
  object: "bench",
  points: "...",
},

{
  type: "polygon",
  object: "bench",
  points: "...",
},
```

Both areas count as the same `bench` object.

This is useful for large objects such as:

- benches
- gates
- trains
- doors

---

## Background Images

Level backgrounds are stored under:

```text
assets/images/levels/
```

Example:

```text
assets/images/levels/level-1/background.png
assets/images/levels/level-2/background.png
```

A level references its background using:

```js
backgroundUrl: new URL(
  "../../assets/images/levels/level-2/background.png",
  import.meta.url,
).href,
```

The `room.width` and `room.height` values should match the background image dimensions.

---

## Hotspots and Background Objects

The visible room objects are currently part of the background image.

Changing hotspot coordinates changes the clickable area only.

It does not move the visible object inside the background image.

---

## Adding a New Level

To create a new level, for example Level 3:

Create:

```text
levels/level-3/level.js
```

Add the background:

```text
assets/images/levels/level-3/background.png
```

If the level uses audio, add:

```text
assets/audio/levels/level-3/
```

Then create the clues and hotspots inside `level.js`.

---

## Adding the Level to the Manifest

Every playable level must also be added to:

```text
levels/manifest.js
```

Example:

```js
{
  id: 3,

  title: "New Level Title",

  description:
    "Short description of the level.",

  difficulty: "Medium",

  implemented: true,

  image: new URL(
    "../assets/images/levels/level-3/background.png",
    import.meta.url,
  ).href,

  href: "game/game.html?level=3",
},
```

---

## Adding a Level — Quick Checklist

For a normal new level:

```text
1. Create levels/level-N/level.js
2. Add the background image
3. Add optional audio files
4. Add the clue sequence
5. Add hotspot coordinates
6. Add the level to manifest.js
7. Test the level
```

---

## Before Committing a Level

Check that:

- the level ID is unique
- the level follows the standard configuration structure
- the `settings` object exists
- every clue has a `clueType`
- audio clues have a valid `audioFile`
- every clue `id` matches its hotspot `object`
- hotspot coordinates match the background
- room dimensions match the background image
- the clue order is correct
- the completion message is defined
- the level opens correctly from the homepage
- completing the level unlocks the next available level
