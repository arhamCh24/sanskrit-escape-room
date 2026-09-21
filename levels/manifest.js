/* =========================================================
   SANSKRIT ESCAPE ROOM
   LEVEL MANIFEST

   Only real levels should be added here.
========================================================= */

const levels = [
  /* =======================================================
     LEVEL 1
  ======================================================= */

  {
    id: 1,

    title: "The Locked Study",

    description:
      "Follow Sanskrit clues through a cozy study, uncover the hidden key, and escape.",

    difficulty: "Easy",

    /*
      IMPORTANT:
      This tells the application that this level
      actually exists and can be played.
    */

    implemented: true,

    image: new URL(
      "../assets/images/levels/level-1/background.png",
      import.meta.url,
    ).href,

    /*
      This is the actual game URL.
    */

    href: "game/game.html?level=1",
  },
];

export default levels;
