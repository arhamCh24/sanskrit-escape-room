# Adding Levels to Sanskrit Escape Room

This guide explains how to create and edit levels in the Sanskrit Escape Room project.

Each level keeps its own configuration, clue sequence, background, audio files, and clickable areas.

The goal is to make new levels easy to add without changing the main game code.

---

## Level Files

Each level has its own folder inside:

```text
levels/
```

For example:

```text
levels/
├── manifest.js
├── level-1/
│   └── level.js
├── level-2/
│   └── level.js
└── level-3/
    └── level.js
```

Each `level.js` file should follow the same structure.

---

## Standard Level Structure

Use this format when creating a new level:

```js
const level = {
  id: 1,

  gameTitle: "Sanskrit Escape Room",

  roomName: "Level Name",

  mission: "Describe the goal of the level.",

  tip: "Give the player a short helpful tip.",

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

    message: "You successfully completed the level.",
  },

  steps: [
    // Clues go here.
  ],

  hotspots: [
    // Clickable areas go here.
  ],
};

export default level;
```

---

# Level Settings

Every level should include the same `settings` object.

```js
settings: {
  timer: false,
  questions: false,
  audio: false,
  scoring: false,
  randomizeObjects: false,
},
```

Keep all settings in the level file even when they are turned off.

This keeps every level consistent and makes it easier to understand what features a level uses.

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

---

# Creating Clues

Clues are stored inside the:

```js
steps: [];
```

array.

A normal text clue should follow this structure:

```js
{
  id: "book",

  sanskrit: "पुस्तकम्",

  hint:
    "Find the green one among the books.",

  foundLabel: "Book",

  title:
    "You found the book!",

  story:
    "The story text that leads the player toward the next clue.",

  clueType: "text",
},
```

---

# Audio Clues

Audio clues use the same structure but include an `audioFile`.

```js
{
  id: "bag",

  sanskrit: "स्यूतम्",

  hint:
    "Listen carefully and find the object you hear.",

  foundLabel: "Bag",

  title:
    "You found the bag!",

  story:
    "The story text that leads the player toward the next clue.",

  clueType: "audio",

  audioFile: new URL(
    "../../assets/audio/levels/level-2/bag.mp3",
    import.meta.url,
  ).href,
},
```

Audio files should be stored by level:

```text
assets/
└── audio/
    └── levels/
        ├── level-1/
        ├── level-2/
        └── level-3/
```

---

# Changing the Clue Order

The order of objects inside the `steps` array determines the order in which the player receives clues.

For example:

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

creates this sequence:

```text
Book → Lamp → Chair
```

If you move the `lamp` clue above the `book` clue:

```js
steps: [
  {
    id: "lamp",
    ...
  },

  {
    id: "book",
    ...
  },

  {
    id: "chair",
    ...
  },
]
```

the gameplay sequence becomes:

```text
Lamp → Book → Chair
```

To change the sequence, move the complete clue object inside the `steps` array.

---

# Clickable Areas

Clickable objects are defined inside:

```js
hotspots: [];
```

A hotspot connects a location on the background image to an object in the clue sequence.

For example:

```js
{
  type: "polygon",

  object: "book",

  points:
    "865,414 891,408 899,476 875,489 865,484",
},
```

The `object` value should match the clue `id`.

For example:

```js
{
  id: "book",
}
```

matches:

```js
{
  object: "book",
}
```

---

# Moving a Clickable Area

Hotspot coordinates can be changed directly inside `level.js`.

For a polygon:

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

For example:

```text
865,414
```

means:

```text
X = 865
Y = 414
```

Use these rules:

```text
Smaller X = move left
Larger X  = move right

Smaller Y = move up
Larger Y  = move down
```

To move the whole clickable area, adjust all of the coordinates by approximately the same amount.

---

# Circle Hotspots

Some objects work better with a circle.

Example:

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

Changing `cx` moves the area left or right.

Changing `cy` moves it up or down.

Changing `r` changes the size of the clickable area.

---

# Multiple Hotspots for One Object

Large or irregular objects can use more than one hotspot.

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

Both areas count as the same object because both use:

```js
object: "bench";
```

This is useful for larger objects such as:

- benches
- trains
- gates
- doors

---

# Background Images

Each level should keep its background image inside:

```text
assets/images/levels/
```

Example:

```text
assets/
└── images/
    └── levels/
        ├── level-1/
        │   └── background.png
        ├── level-2/
        │   └── background.png
        └── level-3/
            └── background.png
```

Reference the background from the level file:

```js
room: {
  width: 1672,
  height: 941,

  backgroundUrl: new URL(
    "../../assets/images/levels/level-3/background.png",
    import.meta.url,
  ).href,
},
```

The width and height should match the background image.

---

# Important: Hotspots vs Background Objects

The current level objects are part of the background image.

Hotspot coordinates only control the clickable area.

Changing the hotspot coordinates does not move the visible object inside the background image.

For example, moving the train hotspot changes where the player can click, but the train itself stays in the same place in `background.png`.

---

# Adding a New Level

For example, to create Level 3:

### 1. Create the level folder

```text
levels/level-3/
```

### 2. Create the level configuration

```text
levels/level-3/level.js
```

### 3. Add the background

```text
assets/images/levels/level-3/background.png
```

### 4. Add audio files if needed

```text
assets/audio/levels/level-3/
```

### 5. Add the clues

Create the clue sequence inside:

```js
steps: [];
```

### 6. Add the clickable areas

Add the object coordinates inside:

```js
hotspots: [];
```

### 7. Add the level to the manifest

Open:

```text
levels/manifest.js
```

and add the new level.

Example:

```js
{
  id: 3,

  title:
    "New Level Title",

  description:
    "Short description of the level.",

  difficulty:
    "Medium",

  implemented:
    true,

  image: new URL(
    "../assets/images/levels/level-3/background.png",
    import.meta.url,
  ).href,

  href:
    "game/game.html?level=3",
},
```

---

# Quick Checklist

Before committing a new level, check that:

- the level ID is unique
- the level follows the same structure as the other levels
- the `settings` object exists
- every clue contains a `clueType`
- audio clues contain a valid `audioFile`
- audio levels use `settings.audio: true`
- every clue `id` matches its hotspot `object`
- hotspot coordinates line up with the correct object
- room dimensions match the background image
- the clue sequence is correct
- the completion message is defined
- the level opens correctly
- the level completes correctly
- completing the level unlocks the next available level
