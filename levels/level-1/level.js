const level1 = {
  id: 1,
  gameTitle: "THE LOCKED STUDY",
  roomName: "THE LOCKED STUDY",
  mission: "Find the key and escape",
  tip: "Look carefully. Not every object is part of the clue.",

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
    sanskrit: "उत्तमम्!",
    message: "You escaped the room!",
  },

  steps: [
    {
      id: "book",
      sanskrit: "पुस्तकम्",
      hint: "Find the green one among the books.",
      foundLabel: "Book",
      title: "You found the book!",
      story:
        "A small note is tucked inside. It says: “The room is getting dark. Find something that can give you light.”",
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
    },
    {
      id: "chair",
      sanskrit: "आसन्दः",
      hint: "Look near the place where you would sit.",
      foundLabel: "Chair",
      title: "Another clue!",
      story:
        "You notice a note underneath it: “The key was hidden somewhere old and wooden.”",
    },
    {
      id: "chest",
      sanskrit: "कुञ्चिका",
      hint: "Search the old wooden chest.",
      foundLabel: "Key",
      title: "You found the key!",
      story:
        "Inside the chest is कुञ्चिका — the key. There is only one thing left to do.",
    },
    {
      id: "door",
      sanskrit: "द्वारम्",
      hint: "You have the key. Where should you use it?",
      foundLabel: "Door",
      title: "You escaped! 🎉",
      story:
        "The key turns, the lock opens, and you escape the study room. Level 1 complete!",
    },
  ],

  hotspots: [
    {
      type: "polygon",
      object: "book",
      points: "865,414 891,408 899,476 875,489 865,484",
    },
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
    {
      type: "polygon",
      object: "plant",
      points: "897,398 930,392 955,420 950,483 904,489 895,445",
    },
    {
      type: "polygon",
      object: "lamp",
      points:
        "33,398 72,397 91,356 119,328 143,313 148,277 169,248 205,251 226,279 226,309 205,331 168,340 128,353 101,383 92,429 42,435",
    },
    {
      type: "polygon",
      object: "chair",
      points:
        "452,388 536,402 529,531 514,649 510,730 454,731 449,625 304,624 299,558 447,529",
    },
    {
      type: "polygon",
      object: "chest",
      points: "0,755 289,742 350,770 369,815 363,941 0,941",
    },
    {
      type: "polygon",
      object: "door",
      points: "1363,63 1581,0 1642,0 1642,719 1370,642",
    },
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
