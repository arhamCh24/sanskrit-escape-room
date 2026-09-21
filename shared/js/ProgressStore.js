const PREFIX = "sanskritEscapeRoomProgress:v1";

function storageKey(userId) {
  return `${PREFIX}:${userId || "guest"}`;
}

function nowIso() {
  return new Date().toISOString();
}

function makeLevelState(id, unlocked = false) {
  return {
    id,
    unlocked,
    completed: false,
    attempts: 0,
    bestScore: 0,
    bestTimeSeconds: null,
    completedAt: null,
    lastPlayedAt: null
  };
}

function createDefaultState(userId, levelIds) {
  const ids = [...new Set(levelIds.map(Number).filter(Number.isInteger))].sort((a,b)=>a-b);
  const levels = {};

  ids.forEach((id, index) => {
    levels[id] = makeLevelState(id, index === 0);
  });

  return {
    version: 1,
    userId: userId || "guest",
    currentLevel: ids[0] || 1,
    highestUnlockedLevel: ids[0] || 1,
    totalScore: 0,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    levels
  };
}

function safeParse(raw) {
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function migrateLegacy(state, levelIds) {
  levelIds.forEach(id => {
    const legacyKeys = [
      `sanskritEscapeRoom_level_${id}`,
      `sanskritEscapeRoom_level${id}`
    ];

    const legacyCompleted = legacyKeys.some(key => {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return false;
        if (raw === "complete") return true;
        const parsed = safeParse(raw);
        return Boolean(parsed?.completed);
      } catch {
        return false;
      }
    });

    if (legacyCompleted && state.levels[id]) {
      state.levels[id].completed = true;
      state.levels[id].unlocked = true;
      state.levels[id].completedAt ||= nowIso();
      state.highestUnlockedLevel = Math.max(state.highestUnlockedLevel, id + 1);
    }
  });

  return state;
}

export function createProgressStore(userId, levelIds = [1]) {
  const ids = [...new Set(levelIds.map(Number).filter(Number.isInteger))].sort((a,b)=>a-b);
  const key = storageKey(userId);

  function normalize(existing) {
    const base = existing && typeof existing === "object"
      ? existing
      : createDefaultState(userId, ids);

    base.version = 1;
    base.userId = userId || "guest";
    base.levels ||= {};
    base.totalScore = Number(base.totalScore) || 0;
    base.currentLevel = Number(base.currentLevel) || (ids[0] || 1);
    base.highestUnlockedLevel = Number(base.highestUnlockedLevel) || (ids[0] || 1);

    ids.forEach((id, index) => {
      const current = base.levels[id] || {};
      base.levels[id] = {
        ...makeLevelState(id, index === 0),
        ...current,
        id,
        unlocked: Boolean(current.unlocked || index === 0 || id <= base.highestUnlockedLevel)
      };
    });

    base.updatedAt ||= nowIso();
    return migrateLegacy(base, ids);
  }

  function read() {
    let stored = null;
    try { stored = safeParse(localStorage.getItem(key)); } catch {}
    const state = normalize(stored);
    write(state);
    return state;
  }

  function write(state) {
    state.updatedAt = nowIso();
    try { localStorage.setItem(key, JSON.stringify(state)); } catch {}
  }

  function snapshot() {
    return clone(read());
  }

  function startLevel(levelId) {
    const id = Number(levelId);
    const state = read();
    const level = state.levels[id] || makeLevelState(id, id <= state.highestUnlockedLevel);

    level.unlocked = true;
    level.attempts = (Number(level.attempts) || 0) + 1;
    level.lastPlayedAt = nowIso();
    state.levels[id] = level;
    state.currentLevel = id;
    state.highestUnlockedLevel = Math.max(state.highestUnlockedLevel, id);
    write(state);
    return clone(state);
  }

  function completeLevel(levelId, { score = 0, timeSeconds = null } = {}) {
    const id = Number(levelId);
    const state = read();
    const level = state.levels[id] || makeLevelState(id, true);
    const previousBest = Number(level.bestScore) || 0;
    const numericScore = Number(score) || 0;
    const numericTime = Number.isFinite(Number(timeSeconds)) ? Number(timeSeconds) : null;

    level.unlocked = true;
    level.completed = true;
    level.bestScore = Math.max(previousBest, numericScore);
    level.completedAt = nowIso();
    level.lastPlayedAt = nowIso();

    if (numericTime !== null && numericTime >= 0) {
      level.bestTimeSeconds = level.bestTimeSeconds === null
        ? numericTime
        : Math.min(level.bestTimeSeconds, numericTime);
    }

    state.levels[id] = level;
    state.totalScore = Object.values(state.levels).reduce((sum, item) => sum + (Number(item.bestScore) || 0), 0);

    const nextId = ids.find(candidate => candidate > id);
    if (nextId) {
      state.levels[nextId].unlocked = true;
      state.highestUnlockedLevel = Math.max(state.highestUnlockedLevel, nextId);
      state.currentLevel = nextId;
    } else {
      state.highestUnlockedLevel = Math.max(state.highestUnlockedLevel, id);
      state.currentLevel = id;
    }

    write(state);
    return clone(state);
  }

  function reset() {
    const state = createDefaultState(userId, ids);
    write(state);
    return clone(state);
  }

  return {
    getSnapshot: snapshot,
    startLevel,
    completeLevel,
    reset
  };
}
