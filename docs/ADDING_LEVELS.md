# Adding Levels to Sanskrit Escape Room

This guide explains how to create and edit levels in the Sanskrit Escape Room project.

Each level keeps its own:

- level information
- gameplay settings
- scoring rules
- timer settings
- clue sequence
- stronger help hints
- background image
- optional audio
- clickable hotspots

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
    timer: true,
    questions: false,
    audio: false,
    scoring: true,
    randomizeObjects: false,
  },

  scoring: {
    maxScore: 100,
    wrongClickPenalty: 5,
    maxTimePenalty: 20,
    chancesPerClue: 3,
  },

  timer: {
    durationSeconds: 240,
    perfectTimeSeconds: 30,
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
    // Correct gameplay objects go here.
  ],
};

export default level;
```

---

# Level Settings

Every level should include the same `settings` object.

```js
settings: {
  timer: true,
  questions: false,
  audio: false,
  scoring: true,
  randomizeObjects: false,
},
```

Keep all settings in the level file even when a feature is turned off.

This keeps every level consistent and makes it easier to understand which features a level uses.

For example, a level containing audio clues can use:

```js
settings: {
  timer: true,
  questions: false,
  audio: true,
  scoring: true,
  randomizeObjects: false,
},
```

---

# Scoring

The current Escape Room scoring system uses a maximum score of:

```text
100
```

Every level using scoring should include:

```js
scoring: {
  maxScore: 100,
  wrongClickPenalty: 5,
  maxTimePenalty: 20,
  chancesPerClue: 3,
},
```

The score is affected by:

```text
incorrect clicks
+
completion time
```

Scores are whole numbers.

No decimal scores are used.

The final score never goes below:

```text
0
```

---

# What Counts as a Wrong Click?

Any click that does not select the current correct clue object counts as a wrong attempt.

This includes clicking:

- another clue object
- furniture
- decoration
- wall
- floor
- empty background
- any other incorrect area of the room

For example, if the current clue is:

```text
Book
```

and the player clicks the lamp, that counts as a wrong attempt even though the lamp may become the correct answer for a later clue.

The game only cares whether the selected object matches the current clue.

---

# Wrong Click Penalty

Every incorrect click deducts:

```text
5 points
```

The penalty is configured with:

```js
wrongClickPenalty: 5,
```

Example:

```text
Starting score: 100

1 wrong click:
100 - 5 = 95

2 wrong clicks:
95 - 5 = 90

3 wrong clicks:
90 - 5 = 85
```

---

# Chances Per Clue

Each clue begins with:

```text
3 / 3
```

chances.

Configured with:

```js
chancesPerClue: 3,
```

The flow is:

```text
Start clue
3 / 3
↓
Wrong click
-5 points
↓
2 / 3
↓
Wrong click
-5 points
↓
1 / 3
STRONGER HINT
↓
Wrong click
-5 points
↓
0 / 3
HIGHLIGHT CORRECT OBJECT
```

The maximum wrong-click deduction for one clue is:

```text
3 × 5 = 15 points
```

---

# Stronger Hint

Every clue should include a `helpHint`.

Example:

```js
{
  id: "book",

  sanskrit: "पुस्तकम्",

  hint:
    "Find the green one among the books.",

  helpHint:
    "Look at the lower bookshelf. Find the single standing green book.",

  foundLabel: "Book",

  title:
    "You found the book!",

  story:
    "The story text that leads the player toward the next clue.",

  clueType: "text",
},
```

The normal hint is shown while the player has:

```text
3 / 3
```

or:

```text
2 / 3
```

chances remaining.

When the player reaches:

```text
1 / 3
```

the game replaces the normal hint with the stronger `helpHint`.

The correct object is not highlighted yet.

The player still has one final attempt to find it using the stronger hint.

---

# Correct Object Highlight

If the player uses the final chance and reaches:

```text
0 / 3
```

the game highlights the correct object.

The flow becomes:

```text
0 / 3
↓
correct object highlights
↓
no more score deductions for this clue
↓
player clicks the highlighted object
↓
story popup
↓
next clue
```

The clue is not automatically completed.

The player must still click the highlighted object.

When the next clue starts:

```text
Chances reset to 3 / 3
```

The overall level score does not reset.

---

# No Special Wrong Hotspots

Do not create hotspots only to detect wrong objects.

For example, do not add:

```js
{
  object: "other-book",
}
```

just so that clicking another book can count as wrong.

Do not add decorative hotspots only for:

```text
plants
globes
drawers
decorations
```

unless those objects are real clue objects in the level.

The game now treats any click outside the current correct object as a wrong attempt automatically.

This keeps the gameplay consistent across the entire background.

---

# Timer

Every level can use a different timer.

Example:

```js
timer: {
  durationSeconds: 240,
  perfectTimeSeconds: 30,
},
```

For example:

```js
// Level 1

timer: {
  durationSeconds: 240,
  perfectTimeSeconds: 30,
},
```

```js
// Level 2

timer: {
  durationSeconds: 300,
  perfectTimeSeconds: 45,
},
```

Different levels can use different timer values depending on:

```text
number of clues
difficulty
audio clues
level complexity
```

Timer values can be adjusted after play testing.

---

# Total Level Time

`durationSeconds` controls the total puzzle-solving time available.

Example:

```js
durationSeconds: 240,
```

means:

```text
240 seconds
=
4 minutes
```

Another example:

```js
durationSeconds: 300,
```

means:

```text
300 seconds
=
5 minutes
```

---

# Perfect Time

`perfectTimeSeconds` controls how quickly the player must finish to receive no timer penalty.

Example:

```js
perfectTimeSeconds: 30,
```

means:

```text
Finish within 30 seconds
=
0 timer penalty
```

---

# Perfect Score

A player receives:

```text
100 / 100
```

when both conditions are met:

```text
0 wrong clicks
+
finish within perfectTimeSeconds
```

Example:

```text
Wrong clicks: 0
Completion time: 28 seconds
Perfect time: 30 seconds

Final score: 100
```

---

# Time Penalty

After `perfectTimeSeconds` has passed, the time penalty gradually increases.

The maximum timer deduction is configured with:

```js
maxTimePenalty: 20,
```

This means the timer can deduct up to:

```text
20 points
```

The timer penalty is calculated using whole numbers.

---

# Final Score

The final score is calculated from:

```text
Maximum score
-
wrong-click penalties
-
timer penalty
```

Example:

```text
Maximum score: 100

Wrong clicks: 2

Wrong-click penalty:
2 × 5 = 10

Time penalty:
4

Final score:

100 - 10 - 4
=
86
```

So the player receives:

```text
86 / 100
```

---

# Timer and Story Popups

The timer pauses while a clue-discovered story popup is open.

Example:

```text
Player finds the Book
↓
Timer pauses
↓
Story popup opens
↓
Player reads the story
↓
Player clicks Continue
↓
Next clue starts
↓
Timer resumes
```

This means the score measures active puzzle-solving time rather than reading speed.

---

# What Happens When the Timer Reaches Zero

If the timer reaches:

```text
00:00
```

before the level is completed, the attempt ends.

The game shows:

```text
TIME'S UP
```

The player can:

```text
Try Again
```

or:

```text
Back to Home
```

When time expires:

```text
the level is NOT completed
the next level is NOT unlocked
no successful completion score is saved
```

If the player previously completed the level, the failed attempt does not replace the player's previous best result.

---

# Successful Level Completion

When the player successfully finishes the level before the timer reaches zero, the game saves:

```text
final score
completion time
```

The progress system keeps:

```text
best score
fastest completion time
```

The next available level is also unlocked.

---

# Creating Clues

Clues are stored inside:

```js
steps: [];
```

The order inside the `steps` array determines the gameplay order.

---

# Text Clues

A normal text clue should follow this structure:

```js
{
  id: "book",

  sanskrit: "पुस्तकम्",

  hint:
    "Find the green one among the books.",

  helpHint:
    "Look at the lower bookshelf. Find the single standing green book.",

  foundLabel: "Book",

  title:
    "You found the book!",

  story:
    "The story text that leads the player toward the next clue.",

  clueType: "text",
},
```

Important fields are:

```text
id
sanskrit
hint
helpHint
foundLabel
title
story
clueType
```

---

# Audio Clues

Audio clues use the same structure but include an `audioFile`.

Example:

```js
{
  id: "bag",

  sanskrit: "स्यूतम्",

  hint:
    "Listen carefully and find the object you hear.",

  helpHint:
    "Look at the brown backpack resting on the waiting bench.",

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

A level containing audio clues should use:

```js
settings: {
  timer: true,
  questions: false,
  audio: true,
  scoring: true,
  randomizeObjects: false,
},
```

---

# Changing the Clue Order

The order of objects inside the `steps` array determines the order in which the player receives clues.

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

creates:

```text
Book → Lamp → Chair
```

If the `lamp` clue is moved above the `book` clue:

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

the gameplay becomes:

```text
Lamp → Book → Chair
```

To change the gameplay order, move the complete clue object.

---

# Clickable Areas

Clickable clue objects are defined inside:

```js
hotspots: [];
```

A hotspot connects a visible object in the background to a clue object.

Example:

```js
{
  type: "polygon",

  object: "book",

  points:
    "865,414 891,408 899,476 875,489 865,484",
},
```

The `object` value should match the clue `id`.

Example clue:

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

Only actual gameplay objects need hotspots.

---

# Clicking Future Clue Objects

A hotspot can belong to a real clue object without being correct at the current moment.

For example:

```text
Current clue:
Book
```

If the player clicks:

```text
Lamp
```

the click counts as wrong because the current clue is still:

```text
Book
```

The player loses:

```text
1 chance
5 points
```

When the Lamp clue becomes active later, clicking the same lamp hotspot will be correct.

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

To move the whole clickable area, adjust all coordinates by approximately the same amount.

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

Changing `cy` moves the area up or down.

Changing `r` changes the size of the clickable area.

---

# Rectangle Hotspots

Rectangle hotspots can also be used.

Example:

```js
{
  type: "rect",

  object: "board",

  x: 500,

  y: 200,

  width: 250,

  height: 180,
},
```

Where:

```text
x = left position
y = top position
width = clickable width
height = clickable height
```

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

This is useful for objects such as:

- benches
- trains
- gates
- doors

When help highlighting activates, every hotspot using the matching object name is highlighted.

---

# Background Images

Each level should keep its background inside:

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

Current level objects are visually part of the background image.

Hotspot coordinates only control where the player can click the clue object.

Changing hotspot coordinates does not visually move the object inside the background image.

For example, moving the train hotspot changes where the train can be clicked, but the visible train remains in the same place inside:

```text
background.png
```

---

# Level Completion

Every level should include:

```js
completion: {
  title: "Level Complete! 🎉",

  sanskrit: "उत्तमम्!",

  message:
    "You successfully completed the level.",
},
```

The shared controller handles navigation.

The level file only provides the completion content.

The controller decides whether to show:

```text
Next Level
```

or:

```text
Return Home
```

---

# Adding a New Level

For example, to create Level 3:

## 1. Create the Level Folder

```text
levels/level-3/
```

## 2. Create the Level File

```text
levels/level-3/level.js
```

## 3. Add the Standard Settings

```js
settings: {
  timer: true,
  questions: false,
  audio: false,
  scoring: true,
  randomizeObjects: false,
},
```

## 4. Add Scoring

```js
scoring: {
  maxScore: 100,
  wrongClickPenalty: 5,
  maxTimePenalty: 20,
  chancesPerClue: 3,
},
```

Keep the standard scoring rules consistent unless there is a specific future reason to change them.

## 5. Add the Timer

```js
timer: {
  durationSeconds: 240,
  perfectTimeSeconds: 30,
},
```

Timer values can differ between levels.

## 6. Add the Background

```text
assets/images/levels/level-3/background.png
```

## 7. Add Audio If Needed

```text
assets/audio/levels/level-3/
```

If audio is used:

```js
audio: true,
```

must be enabled inside `settings`.

## 8. Add the Clues

Create the sequence inside:

```js
steps: [];
```

Every clue should include:

```text
id
sanskrit
hint
helpHint
foundLabel
title
story
clueType
```

Audio clues should also include:

```text
audioFile
```

## 9. Add Only the Real Clue Hotspots

Add correct gameplay objects inside:

```js
hotspots: [];
```

Do not add fake wrong hotspots just to detect mistakes.

Incorrect background clicks are already handled automatically.

## 10. Add Completion Content

```js
completion: {
  title: "Level Complete! 🎉",

  sanskrit: "उत्तमम्!",

  message:
    "You successfully completed the level.",
},
```

## 11. Add the Level to the Manifest

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
- the level follows the same structure as existing levels
- the `settings` object exists
- `settings.timer` is correct
- `settings.scoring` is correct
- `settings.audio` is correct
- the `scoring` object exists
- `maxScore` is configured
- `wrongClickPenalty` is configured
- `maxTimePenalty` is configured
- `chancesPerClue` is configured
- the `timer` object exists
- `durationSeconds` is configured
- `perfectTimeSeconds` is configured
- every clue contains a `clueType`
- every clue contains a `helpHint`
- audio clues contain a valid `audioFile`
- audio levels use `settings.audio: true`
- every clue `id` matches its correct hotspot `object`
- only actual gameplay objects have hotspots
- fake wrong hotspots are not added
- empty/background clicks deduct one chance
- empty/background clicks deduct the wrong-click penalty
- clicking a future clue object counts as wrong
- the stronger hint appears at `1 / 3`
- the object is not highlighted yet at `1 / 3`
- the correct object highlights at `0 / 3`
- no additional points are deducted after `0 / 3`
- the player still clicks the highlighted object
- chances reset to `3 / 3` for the next clue
- hotspot coordinates line up with the visible objects
- room dimensions match the background image
- the clue sequence is correct
- the timer pauses while story popups are open
- the timer resumes for the next clue
- time expiry ends the attempt
- time expiry does not complete the level
- time expiry does not unlock the next level
- successful completion saves the final score
- successful completion saves the completion time
- successful completion unlocks the next available level
- the level works on desktop, tablet, and mobile
