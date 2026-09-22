const levels = [
  {
    id: 1,

    title: "The Locked Study",

    description:
      "Follow Sanskrit clues through a cozy study, uncover the hidden key, and escape.",

    difficulty: "Easy",

    implemented: true,

    image: new URL(
      "../assets/images/levels/level-1/background.png",
      import.meta.url,
    ).href,

    href: "game/game.html?level=1",
  },

  {
    id: 2,

    title: "The Missing Ticket",

    description:
      "Follow Sanskrit clues through a busy station, find your missing ticket, and reach the correct train.",

    difficulty: "Easy–Medium",

    implemented: true,

    image: new URL(
      "../assets/images/levels/level-2/background.png",
      import.meta.url,
    ).href,

    href: "game/game.html?level=2",
  },
];

export default levels;
