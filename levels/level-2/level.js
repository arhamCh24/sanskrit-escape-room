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

     Level 2 contains audio clues, so audio is enabled.

     Other planned features stay disabled until the shared
     engine supports them.
  --------------------------------------------------------- */

  settings: {
    timer: false,
    questions: false,
    audio: true,
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
      "../../assets/images/levels/level-2/background.png",
      import.meta.url,
    ).href,
  },

  /* ---------------------------------------------------------
     LEVEL COMPLETION

     The shared controller decides whether to show
     "Next Level" or "Back to Home".
  --------------------------------------------------------- */

  completion: {
    title: "Journey Complete! 🎉",

    sanskrit: "उत्तमम्!",

    message:
      "You followed the Sanskrit clues, found your way through the station, and reached the train.",
  },

  /* ---------------------------------------------------------
     CLUE SEQUENCE

     IMPORTANT:
     The order of objects in this array IS the gameplay order.

     Current sequence:

     Bag
       ↓
     Ticket
       ↓
     Clock
       ↓
     Bench
       ↓
     Departure Board
       ↓
     Platform Gate
       ↓
     Train

     To change the sequence, move the WHOLE clue object
     higher or lower in the steps array.
  --------------------------------------------------------- */

  steps: [
    /* =====================================================
       CLUE 1 — BAG
    ===================================================== */

    {
      id: "bag",

      /*
        Keep the Sanskrit word in the data even though this
        clue uses audio.

        GameView hides the word while the audio clue is active.
      */

      sanskrit: "स्यूतम्",

      hint: "Listen carefully and find the object you hear.",

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

      /*
        Stored here for consistency.

        GameView hides the Sanskrit word while the audio clue
        is active.
      */

      sanskrit: "यानम्",

      hint: "Listen carefully and find the object you hear.",

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

     These coordinates control WHERE the player can click.

     IMPORTANT:

     Changing these coordinates changes the CLICKABLE REGION.

     It does NOT visually move the object if the object is
     already painted into background.png.

     Polygon:

       points: "x,y x,y x,y ..."

       smaller X = left
       larger X  = right

       smaller Y = up
       larger Y  = down

     Circle:

       cx = horizontal position
       cy = vertical position
       r  = radius

     Multiple hotspot shapes can use the same "object" name.

     For example several polygons can all use:

       object: "bench"

     and they will all count as the same clue object.
  --------------------------------------------------------- */

  hotspots: [
    /* =====================================================
       BAG / BACKPACK
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

       cx = left/right
       cy = up/down
       r  = clickable size
    ===================================================== */

    {
      type: "circle",

      object: "clock",

      cx: 648,

      cy: 129,

      r: 84,
    },

    /* =====================================================
       BENCH

       The bench is large, so several polygons use the same:

       object: "bench"

       All of them count as the same gameplay object.
    ===================================================== */

    // Upper-left backrest.
    {
      type: "polygon",

      object: "bench",

      points: "62,537 281,528 291,556 288,650 255,681 83,701 62,660",
    },

    // Left-middle seat area.
    {
      type: "polygon",

      object: "bench",

      points: "69,693 274,650 278,717 254,756 87,786 64,752",
    },

    // Lower/front wooden section.
    {
      type: "polygon",

      object: "bench",

      points: "155,778 450,742 424,812 314,899 98,910",
    },

    // Visible bench area behind/right of backpack.
    {
      type: "polygon",

      object: "bench",

      points: "442,532 489,530 511,549 526,601 521,653 489,680 452,667",
    },

    // Far-right section of the bench.
    {
      type: "polygon",

      object: "bench",

      points: "575,740 671,727 687,758 679,799 591,820 575,789",
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

       Several smaller regions make the entrance easier to
       click without creating one oversized hotspot.
    ===================================================== */

    // Left turnstile.
    {
      type: "polygon",

      object: "gate",

      points: "962,476 1065,474 1091,490 1093,620 1050,655 967,645 950,608",
    },

    // Right turnstile.
    {
      type: "polygon",

      object: "gate",

      points: "1214,474 1308,473 1322,491 1322,641 1280,661 1217,650",
    },

    // Horizontal entrance rail.
    {
      type: "polygon",

      object: "gate",

      points: "1067,497 1222,499 1225,567 1068,568",
    },

    /* =====================================================
       TRAIN

       The train is split into several regions instead of
       creating one huge clickable rectangle.
    ===================================================== */

    // Left carriage.
    {
      type: "polygon",

      object: "train",

      points: "829,376 875,373 885,486 834,489",
    },

    // Middle carriage.
    {
      type: "polygon",

      object: "train",

      points: "1071,351 1238,350 1238,483 1071,484",
    },

    // Front / locomotive.
    {
      type: "polygon",

      object: "train",

      points: "1303,345 1370,350 1404,375 1420,418 1414,473 1380,493 1305,488",
    },
  ],
};

export default level2;
