(function () {
  window.GameApp = window.GameApp || {};

  class UserModel {
    constructor(storage) {
      this.storage = storage;
      this.usersKey = 'ser_users_v1';
      this.sessionKey = 'ser_session_v1';
    }

    normalizeUsername(username) {
      return String(username || '').trim().toLowerCase();
    }

    validateUsername(username) {
      return /^[a-zA-Z0-9_]{3,20}$/.test(username);
    }

    async hashPassword(password) {
      if (!window.crypto || !window.crypto.subtle) {
        throw new Error('Secure hashing is unavailable. Please run the project using localhost or Live Server.');
      }

      const data = new TextEncoder().encode(password);
      const digest = await window.crypto.subtle.digest('SHA-256', data);
      return Array.from(new Uint8Array(digest))
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
    }

    getUsers() {
      try {
        return JSON.parse(this.storage.getItem(this.usersKey)) || {};
      } catch (_error) {
        return {};
      }
    }

    saveUsers(users) {
      this.storage.setItem(this.usersKey, JSON.stringify(users));
    }

    async register(username, password) {
      const displayName = String(username || '').trim();
      const normalized = this.normalizeUsername(displayName);

      if (!this.validateUsername(displayName)) {
        return { ok: false, message: 'Use 3–20 letters, numbers, or underscores for the username.' };
      }

      if (String(password || '').length < 6) {
        return { ok: false, message: 'Password must be at least 6 characters.' };
      }

      const users = this.getUsers();
      if (users[normalized]) {
        return { ok: false, message: 'That username already exists.' };
      }

      const passwordHash = await this.hashPassword(password);
      users[normalized] = {
        username: normalized,
        displayName,
        passwordHash,
        createdAt: new Date().toISOString()
      };
      this.saveUsers(users);
      this.storage.setItem(this.sessionKey, normalized);

      return { ok: true, user: users[normalized] };
    }

    async login(username, password) {
      const normalized = this.normalizeUsername(username);
      const users = this.getUsers();
      const user = users[normalized];

      if (!user) {
        return { ok: false, message: 'Username or password is incorrect.' };
      }

      const passwordHash = await this.hashPassword(password);
      if (passwordHash !== user.passwordHash) {
        return { ok: false, message: 'Username or password is incorrect.' };
      }

      this.storage.setItem(this.sessionKey, normalized);
      return { ok: true, user };
    }

    logout() {
      this.storage.removeItem(this.sessionKey);
    }

    getCurrentUser() {
      const normalized = this.storage.getItem(this.sessionKey);
      if (!normalized) return null;

      const users = this.getUsers();
      return users[normalized] || null;
    }
  }

  window.GameApp.UserModel = UserModel;
})();
