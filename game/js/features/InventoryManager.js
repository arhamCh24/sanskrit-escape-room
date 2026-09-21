export default class InventoryManager {
  constructor() {
    this.items = new Set();
  }

  add(item) {
    this.items.add(item);
  }

  has(item) {
    return this.items.has(item);
  }

  remove(item) {
    this.items.delete(item);
  }

  getAll() {
    return [...this.items];
  }
}
