const STORAGE_KEYS = Object.freeze({
  userId: "zatamUserId",
  userName: "zatamUserName",
  userPhoto: "zatamUserPhoto",
  language: "zatamLanguage"
});

function safeGet(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function cleanName(value) {
  const name = String(value || "").trim();
  return name || "Player";
}

function cleanPhoto(value) {
  if (!value) return null;

  try {
    const url = new URL(value, window.location.href);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    return url.href;
  } catch {
    return null;
  }
}

export function getZatamUser() {
  return {
    id: safeGet(STORAGE_KEYS.userId) || "guest",
    name: cleanName(safeGet(STORAGE_KEYS.userName)),
    photo: cleanPhoto(safeGet(STORAGE_KEYS.userPhoto)),
    language: safeGet(STORAGE_KEYS.language) || "en"
  };
}

export function getInitials(name) {
  const parts = cleanName(name).split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map(part => part.charAt(0).toUpperCase()).join("") || "P";
}
