const PREFIX = "sanskritEscapeRoomSettings:v1";

function key(userId) {
  return `${PREFIX}:${userId || "guest"}`;
}

const DEFAULTS = Object.freeze({
  soundEnabled: true,
  showHints: true
});

export function createSettingsStore(userId) {
  const storageKey = key(userId);

  function read() {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) || "null");
      return { ...DEFAULTS, ...(parsed || {}) };
    } catch {
      return { ...DEFAULTS };
    }
  }

  function write(next) {
    const value = { ...DEFAULTS, ...next };
    try { localStorage.setItem(storageKey, JSON.stringify(value)); } catch {}
    return value;
  }

  return {
    get: read,
    update(partial) { return write({ ...read(), ...partial }); },
    reset() { return write(DEFAULTS); }
  };
}
