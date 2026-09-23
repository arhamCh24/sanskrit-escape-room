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

     Keep this object in every level, even when a feature is
     disabled. This makes all level files follow one format.
  --------------------------------------------------------- */

  settings: {
    timer: false,
    questions: false,
    audio: false,
    scoring: false,
    randomizeObjects: false,
  },

  /* ---------------------------------------------------------
     ROOM / BACKGROUND

     width and height must match the background artwork.
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

     Navigation buttons are controlled by the shared game
     controller, so level files only provide the content.
  --------------------------------------------------------- */

  completion: {
    title: "Level Complete! 🎉",

    sanskrit: "उत्तमम्!",

    message: "You solved every Sanskrit clue and escaped The Locked Study.",
  },

  /* ---------------------------------------------------------
     CLUE SEQUENCE
     The order of objects in this array IS the gameplay order.

     To change the clue sequence, move the whole clue object
     higher or lower in this array.
  --------------------------------------------------------- */

  steps: [
    {
      id: "book",

      sanskrit: "पुस्तकम्",

      hint: "Find the green one among the books.",

      foundLabel: "Book",

      title: "You found the book!",

      story:
        "A small note is tucked inside. It says: “The room is getting dark. Find something that can give you light.”",

      clueType: "text",

      wrongAnswers: {
        "other-book": "That is a book, but not the green one.",

        plant: "That is the flower pot. Keep looking nearby.",
      },
    },

    {
      id: "lamp",

      sanskrit: "दीपः",

      hint: "What would help you see if the room became dark?",

      foundLabel: "Lamp",

      title: "The light is on!",

      story:
        "The light reveals another message: “Your next clue is close to the place where you would sit.”",

      clueType: "text",
    },

    {
      id: "chair",

      sanskrit: "आसन्दः",

      hint: "Look near the place where you would sit.",

      foundLabel: "Chair",

      title: "Another clue!",

      story:
        "You notice a note underneath it: “The key was hidden somewhere old and wooden.”",

      clueType: "text",
    },

    {
      id: "chest",

      sanskrit: "कुञ्चिका",

      hint: "Search the old wooden chest.",

      foundLabel: "Key",

      title: "You found the key!",

      story:
        "Inside the chest is कुञ्चिका — the key. There is only one thing left to do.",

      clueType: "text",
    },

    {
      id: "door",

      sanskrit: "द्वारम्",

      hint: "You have the key. Where should you use it?",

      foundLabel: "Door",

      title: "You escaped! 🎉",

      story:
        "The key turns, the lock opens, and you escape the study room. Level 1 complete!",

      clueType: "text",
    },
  ],

  /* ---------------------------------------------------------
     CLICKABLE HOTSPOTS

     These coordinates define WHERE the player can click.

     IMPORTANT:
     Changing these coordinates moves only the clickable area.
     It does NOT visually move an object that is already drawn
     inside background.png.

     For polygons:
       points: "x,y x,y x,y ..."

       X smaller = move left
       X larger  = move right
       Y smaller = move up
       Y larger  = move down

     For circles:
       cx = horizontal position
       cy = vertical position
       r  = clickable radius

     The "object" value must match a clue "id", or an optional
     wrong-answer object such as "other-book".
  --------------------------------------------------------- */

  hotspots: [
    // Correct green book.
    {
      type: "polygon",
      object: "book",
      points: "865,414 891,408 899,476 875,489 865,484",
    },

    // Other books are clickable so Level 1 can give a custom
    // wrong-answer message when the player chooses them.
    {
      type: "polygon",
      object: "other-book",
      points: "808,400 862,399 867,484 809,489",
    },

    {
      type: "polygon",
      object: "other-book",
      points: "966,445 1071,446 1071,495 964,494",
    },

    {
      type: "polygon",
      object: "other-book",
      points: "810,158 914,164 914,249 809,249",
    },

    // Flower pot near the books.
    {
      type: "polygon",
      object: "plant",
      points: "897,398 930,392 955,420 950,483 904,489 895,445",
    },

    // Lamp.
    {
      type: "polygon",
      object: "lamp",
      points:
        "33,398 72,397 91,356 119,328 143,313 148,277 169,248 205,251 226,279 226,309 205,331 168,340 128,353 101,383 92,429 42,435",
    },

    // Chair.
    {
      type: "polygon",
      object: "chair",
      points:
        "452,388 536,402 529,531 514,649 510,730 454,731 449,625 304,624 299,558 447,529",
    },

    // Wooden chest containing the key.
    {
      type: "polygon",
      object: "chest",
      points: "0,755 289,742 350,770 369,815 363,941 0,941",
    },

    // Exit door.
    {
      type: "polygon",
      object: "door",
      points: "1363,63 1581,0 1642,0 1642,719 1370,642",
    },

    // Decorative objects can still be clickable.
    // They use the shared default wrong-answer message.
    {
      type: "circle",
      object: "globe",
      cx: 1033,
      cy: 206,
      r: 49,
    },

    {
      type: "circle",
      object: "clock",
      cx: 1220,
      cy: 111,
      r: 67,
    },

    {
      type: "polygon",
      object: "drawers",
      points: "1105,421 1288,420 1285,638 1107,642",
    },
  ],
};

export default level1;
