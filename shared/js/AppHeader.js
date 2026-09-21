import { getInitials } from "./ZatamSession.js";

const PORTAL_HOME = "https://zatam2.vercel.app/";

function icon(name) {
  const icons = {
    home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5v8a1 1 0 0 1-1 1h-5.5v-6h-5v6H4a1 1 0 0 1-1-1z"/></svg>',
    grid: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>',
    sound: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path class="sound-wave" d="M16 8c1.2 1 1.8 2.3 1.8 4S17.2 15 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path class="sound-wave" d="M18.5 5.5C20.2 7.2 21 9.4 21 12s-.8 4.8-2.5 6.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    settings: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.4 13a7.7 7.7 0 0 0 .1-1 7.7 7.7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a7.7 7.7 0 0 0-1.8-1L15 3.5h-4L10.6 6a7.7 7.7 0 0 0-1.8 1l-2.4-1-2 3.4 2 1.5a7.7 7.7 0 0 0-.1 1 7.7 7.7 0 0 0 .1 1l-2 1.5 2 3.4 2.4-1a7.7 7.7 0 0 0 1.8 1l.4 2.5h4l.4-2.5a7.7 7.7 0 0 0 1.8-1l2.4 1 2-3.4zM13 15.5A3.5 3.5 0 1 1 13 8a3.5 3.5 0 0 1 0 7.5z"/></svg>'
  };
  return icons[name] || "";
}

function makeIconLink({ href, label, name, className = "" }) {
  const link = document.createElement("a");
  link.href = href;
  link.className = `app-icon-button ${className}`.trim();
  link.setAttribute("aria-label", label);
  link.title = label;
  link.innerHTML = icon(name);
  return link;
}

function makeIconButton({ label, name, className = "" }) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `app-icon-button ${className}`.trim();
  button.setAttribute("aria-label", label);
  button.title = label;
  button.innerHTML = icon(name);
  return button;
}

export function mountAppHeader({
  container,
  user,
  gameHomeHref = "./index.html",
  showGameHomeButton = false,
  settingsStore = null,
  onOpenSettings = null
}) {
  if (!container) return null;

  const header = document.createElement("header");
  header.className = "escape-app-header";

  const left = document.createElement("div");
  left.className = "escape-app-header__left";
  left.appendChild(makeIconLink({ href: PORTAL_HOME, label: "Back to zat.am portal", name: "home", className: "portal-home" }));

  const brand = document.createElement("a");
  brand.href = gameHomeHref;
  brand.className = "escape-game-brand";
  brand.innerHTML = '<span class="escape-game-brand__mark">ॐ</span><span><strong>Sanskrit Escape Room</strong><small>Learn • Search • Escape</small></span>';
  left.appendChild(brand);

  if (showGameHomeButton) {
    const gameHome = makeIconLink({ href: gameHomeHref, label: "Escape Room home", name: "grid", className: "game-home" });
    left.appendChild(gameHome);
  }

  const right = document.createElement("div");
  right.className = "escape-app-header__right";

  const sound = makeIconButton({ label: "Toggle sound", name: "sound", className: "sound-toggle" });
  const settings = settingsStore?.get?.() || { soundEnabled: true };
  sound.classList.toggle("is-muted", !settings.soundEnabled);
  sound.addEventListener("click", () => {
    if (!settingsStore) return;
    const current = settingsStore.get();
    const next = settingsStore.update({ soundEnabled: !current.soundEnabled });
    sound.classList.toggle("is-muted", !next.soundEnabled);
    sound.setAttribute("aria-pressed", String(!next.soundEnabled));
  });
  right.appendChild(sound);

  const settingsButton = makeIconButton({ label: "Game settings", name: "settings", className: "settings-button" });
  settingsButton.addEventListener("click", () => onOpenSettings?.());
  right.appendChild(settingsButton);

  const profile = document.createElement("div");
  profile.className = "escape-user-chip";

  const avatar = document.createElement("span");
  avatar.className = "escape-user-chip__avatar";
  avatar.textContent = getInitials(user?.name || "Player");

  if (user?.photo) {
    const img = document.createElement("img");
    img.src = user.photo;
    img.alt = "";
    img.referrerPolicy = "no-referrer";
    img.addEventListener("error", () => img.remove(), { once: true });
    avatar.appendChild(img);
  }

  const copy = document.createElement("span");
  copy.className = "escape-user-chip__copy";
  const small = document.createElement("small");
  small.textContent = "PLAYER";
  const strong = document.createElement("strong");
  strong.textContent = user?.name || "Player";
  copy.append(small, strong);

  profile.append(avatar, copy);
  right.appendChild(profile);

  header.append(left, right);
  container.replaceChildren(header);
  return header;
}

export const ZATAM_PORTAL_HOME = PORTAL_HOME;
