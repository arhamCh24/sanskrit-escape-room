const level1 = {
  /* ---------------------------------------------------------
     BASIC LEVEL INFORMATION
  --------------------------------------------------------- */

  id: 1,

  gameTitle: "Sanskrit Escape Room",

  roomName: "The Locked Study",

  mission: "Find the key and escape.",

  tip: "Look carefully. Not every object is part of the clue.",

  /* ---------------------------------------------------------
     LEVEL FEATURES
  --------------------------------------------------------- */

  settings: {
    timer: true,
    questions: false,
    audio: false,
    scoring: true,
    randomizeObjects: false,
  },

  /* ---------------------------------------------------------
     SCORING
  --------------------------------------------------------- */

  scoring: {
    maxScore: 100,
    wrongClickPenalty: 5,
    maxTimePenalty: 20,
    chancesPerClue: 3,
  },

  /* ---------------------------------------------------------
     TIMER - These values can be adjusted.
  --------------------------------------------------------- */

  timer: {
    durationSeconds: 180,
    perfectTimeSeconds: 30,
  },

  /* ---------------------------------------------------------
     ROOM / BACKGROUND
  --------------------------------------------------------- */

  room: {
    width: 1672,

    height: 941,

    backgroundUrl: new URL(
      "../../assets/images/levels/level-1/background.png",

      import.meta.url,
    ).href,
  },

  /* ---------------------------------------------------------
     LEVEL COMPLETION
  --------------------------------------------------------- */

  completion: {
    title: "Level Complete! 🎉",

    sanskrit: "उत्तमम्!",

    message: "You solved every Sanskrit clue and escaped The Locked Study.",
  },

  /* ---------------------------------------------------------
     CLUE SEQUENCE
  --------------------------------------------------------- */

  steps: [
    /* =====================================================
       CLUE 1 — BOOK
    ===================================================== */

    {
      id: "book",

      sanskrit: "पुस्तकम्",

      hint: "Find the green one among the books.",

      helpHint:
        "Look at the lower bookshelf. Find the single standing green book.",

      foundLabel: "Book",

      title: "You found the book!",

      story:
        "A small note is tucked inside. It says: “The room is getting dark. Find something that can give you light.”",

      clueType: "text",
    },

    /* =====================================================
       CLUE 2 — LAMP
    ===================================================== */

    {
      id: "lamp",

      sanskrit: "दीपः",

      hint: "What would help you see if the room became dark?",

      helpHint: "Look at the tall floor lamp on the left side of the room.",

      foundLabel: "Lamp",

      title: "The light is on!",

      story:
        "The light reveals another message: “Your next clue is close to the place where you would sit.”",

      clueType: "text",
    },

    /* =====================================================
       CLUE 3 — CHAIR
    ===================================================== */

    {
      id: "chair",

      sanskrit: "आसन्दः",

      hint: "Look near the place where you would sit.",

      helpHint: "Look for the wooden chair near the left-center of the room.",

      foundLabel: "Chair",

      title: "Another clue!",

      story:
        "You notice a note underneath it: “The key was hidden somewhere old and wooden.”",

      clueType: "text",
    },

    /* =====================================================
       CLUE 4 — CHEST / KEY
    ===================================================== */

    {
      id: "chest",

      sanskrit: "कुञ्चिका",

      hint: "Search the old wooden chest.",

      helpHint:
        "Look at the old wooden chest in the bottom-left corner of the room.",

      foundLabel: "Key",

      title: "You found the key!",

      story:
        "Inside the chest is कुञ्चिका — the key. There is only one thing left to do.",

      clueType: "text",
    },

    /* =====================================================
       CLUE 5 — DOOR
    ===================================================== */

    {
      id: "door",

      sanskrit: "द्वारम्",

      hint: "You have the key. Where should you use it?",

      helpHint: "Look at the large exit door on the right side of the room.",

      foundLabel: "Door",

      title: "You escaped! 🎉",

      story:
        "The key turns, the lock opens, and you escape the study room. Level 1 complete!",

      clueType: "text",
    },
  ],

  /* ---------------------------------------------------------
     CLICKABLE HOTSPOTS
  --------------------------------------------------------- */

  hotspots: [
    /* =====================================================
       BOOK
    ===================================================== */

    {
      type: "polygon",

      object: "book",

      points: "865,414 891,408 899,476 875,489 865,484",
    },

    /* =====================================================
       LAMP
    ===================================================== */

    {
      type: "polygon",

      object: "lamp",

      points:
        "33,398 72,397 91,356 119,328 143,313 148,277 169,248 205,251 226,279 226,309 205,331 168,340 128,353 101,383 92,429 42,435",
    },

    /* =====================================================
       CHAIR
    ===================================================== */

    {
      type: "polygon",

      object: "chair",

      points:
        "452,388 536,402 529,531 514,649 510,730 454,731 449,625 304,624 299,558 447,529",
    },

    /* =====================================================
       CHEST
    ===================================================== */

    {
      type: "polygon",

      object: "chest",

      points: "0,755 289,742 350,770 369,815 363,941 0,941",
    },

    /* =====================================================
       DOOR
    ===================================================== */

    {
      type: "polygon",

      object: "door",

      points: "1363,63 1581,0 1642,0 1642,719 1370,642",
    },
  ],
};

export default level1;
