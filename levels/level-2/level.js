const level2 = {
  /* ---------------------------------------------------------
     BASIC LEVEL INFORMATION
  --------------------------------------------------------- */

  id: 2,

  gameTitle: "Sanskrit Escape Room",

  roomName: "The Missing Ticket",

  mission:
    "Your journey is about to begin, but you need to follow the Sanskrit clues and find your way to the correct train.",

  tip: "Look carefully around the station. Some clues may require you to listen instead of read.",

  /* ---------------------------------------------------------
     LEVEL FEATURES
  --------------------------------------------------------- */

  settings: {
    timer: true,
    questions: false,
    audio: true,
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
     TIMER
  --------------------------------------------------------- */

  timer: {
    durationSeconds: 180,
    perfectTimeSeconds: 45,
  },

  /* ---------------------------------------------------------
     ROOM / BACKGROUND
  --------------------------------------------------------- */

  room: {
    width: 1672,

    height: 941,

    backgroundUrl: new URL(
      "../../assets/images/levels/level-2/background.png",

      import.meta.url,
    ).href,
  },

  /* ---------------------------------------------------------
     LEVEL COMPLETION
  --------------------------------------------------------- */

  completion: {
    title: "Journey Complete! 🎉",

    sanskrit: "उत्तमम्!",

    message:
      "You followed the Sanskrit clues, found your way through the station, and reached the train.",
  },

  /* ---------------------------------------------------------
     CLUE SEQUENCE
  --------------------------------------------------------- */

  steps: [
    /* =====================================================
       CLUE 1 — BAG
    ===================================================== */

    {
      id: "bag",

      sanskrit: "स्यूतम्",

      hint: "Listen carefully and find the object you hear.",

      helpHint: "Look at the brown backpack resting on the waiting bench.",

      foundLabel: "Bag",

      title: "You found the bag!",

      story:
        "Inside the travel bag you discover a note. It says that your journey cannot begin without something very important.",

      clueType: "audio",

      audioFile: new URL(
        "../../assets/audio/levels/level-2/bag.mp3",

        import.meta.url,
      ).href,
    },

    /* =====================================================
       CLUE 2 — TICKET
    ===================================================== */

    {
      id: "ticket",

      sanskrit: "चीटिकाम्",

      hint: "Your journey cannot begin without this important travel item.",

      helpHint: "Look on the bench beside the travel bag for the small ticket.",

      foundLabel: "Ticket",

      title: "You found the ticket!",

      story:
        "The ticket is finally yours, but you still do not know when you should leave. Something nearby can help you check the time.",

      clueType: "text",
    },

    /* =====================================================
       CLUE 3 — CLOCK
    ===================================================== */

    {
      id: "clock",

      sanskrit: "घटी",

      hint: "Your ticket is ready. Now find something that helps you know the time.",

      helpHint: "Look high on the wall near the center-left of the station.",

      foundLabel: "Clock",

      title: "You found the clock!",

      story:
        "There is still time before departure. You decide to wait for a moment. Find a place where a traveller could sit.",

      clueType: "text",
    },

    /* =====================================================
       CLUE 4 — BENCH
    ===================================================== */

    {
      id: "bench",

      sanskrit: "आसन्दः",

      hint: "Find the place where travellers can sit while they wait.",

      helpHint: "Look at the long wooden waiting bench on the left side.",

      foundLabel: "Waiting Bench",

      title: "You found the waiting area!",

      story:
        "While waiting, you realize you still need to know where your departure is. Look for the place where station information is displayed.",

      clueType: "text",
    },

    /* =====================================================
       CLUE 5 — DEPARTURE BOARD
    ===================================================== */

    {
      id: "board",

      sanskrit: "फलकम्",

      hint: "Find the place where travel information is displayed.",

      helpHint:
        "Look at the large information board hanging above the waiting area.",

      foundLabel: "Departure Board",

      title: "You found the departure board!",

      story:
        "The board shows you where to go. Your train is beyond the station entrance. Find the way through to the platform.",

      clueType: "text",
    },

    /* =====================================================
       CLUE 6 — PLATFORM GATE
    ===================================================== */

    {
      id: "gate",

      sanskrit: "अग्रे गच्छतु ।",

      hint: "Go forward. Find the entrance that leads toward the platform.",

      helpHint:
        "Look for the turnstile entrance that leads toward the train platform.",

      foundLabel: "Platform Gate",

      title: "The way is open!",

      story:
        "You pass through the gate. Your journey is almost ready to begin. One final thing is waiting outside.",

      clueType: "text",
    },

    /* =====================================================
       CLUE 7 — TRAIN
    ===================================================== */

    {
      id: "train",

      sanskrit: "यानम्",

      hint: "Listen carefully and find the object you hear.",

      helpHint: "Look through the platform entrance for the visible train.",

      foundLabel: "Train",

      title: "You found the train!",

      story:
        "You reached the correct train with your ticket and luggage. Your journey can finally begin!",

      clueType: "audio",

      audioFile: new URL(
        "../../assets/audio/levels/level-2/train.mp3",

        import.meta.url,
      ).href,
    },
  ],

  /* ---------------------------------------------------------
     CLICKABLE HOTSPOTS
  --------------------------------------------------------- */

  hotspots: [
    /* =====================================================
     BENCH
  ===================================================== */

    // Main bench body / backrest / seat.
    {
      type: "polygon",

      object: "bench",

      points:
        "58,524 492,524 526,548 531,612 523,654 488,683 565,700 675,721 697,755 690,804 655,820 592,831 514,821 428,817 365,862 316,905 225,919 98,919 70,882 61,821 60,753 60,660",
    },

    /*
    Extra lower/front coverage.
  */
    {
      type: "polygon",

      object: "bench",

      points:
        "68,690 185,669 280,648 377,655 459,682 574,713 675,730 698,764 683,811 590,834 430,824 316,910 96,921 71,870",
    },

    /*
    Extra center section.
  */
    {
      type: "polygon",

      object: "bench",

      points:
        "257,528 490,528 525,550 528,614 518,655 484,686 441,704 372,718 296,729 254,701",
    },

    /*
    Right side of the bench.
  */
    {
      type: "polygon",

      object: "bench",

      points:
        "433,661 523,651 573,692 674,720 701,755 691,805 655,822 589,834 520,819 451,796",
    },

    /* =====================================================
     BAG
  ===================================================== */

    {
      type: "polygon",

      object: "bag",

      points:
        "315,560 445,565 310,556 400,560 441,624 458,735 439,740 382,754 320,744 286,711 273,647",
    },

    /* =====================================================
     TICKET
  ===================================================== */

    {
      type: "polygon",

      object: "ticket",

      points: "467,746 558,733 574,772 484,793",
    },

    /* =====================================================
     CLOCK
  ===================================================== */

    {
      type: "circle",

      object: "clock",

      cx: 648,

      cy: 129,

      r: 84,
    },

    /* =====================================================
     DEPARTURE BOARD
  ===================================================== */

    {
      type: "polygon",

      object: "board",

      points: "525,208 770,233 772,412 523,405",
    },

    /* =====================================================
     PLATFORM GATE
  ===================================================== */

    {
      type: "polygon",

      object: "gate",

      points: "962,476 1065,474 1091,490 1093,620 1050,655 967,645 950,608",
    },

    {
      type: "polygon",

      object: "gate",

      points: "1214,474 1308,473 1322,491 1322,641 1280,661 1217,650",
    },

    {
      type: "polygon",

      object: "gate",

      points: "1067,497 1222,499 1225,567 1068,568",
    },

    /* =====================================================
     TRAIN
  ===================================================== */

    {
      type: "polygon",

      object: "train",

      points: "829,376 875,373 885,486 834,489",
    },

    {
      type: "polygon",

      object: "train",

      points: "1071,351 1238,350 1238,483 1071,484",
    },

    {
      type: "polygon",

      object: "train",

      points: "1303,345 1370,350 1404,375 1420,418 1414,473 1380,493 1305,488",
    },
  ],
};

export default level2;
