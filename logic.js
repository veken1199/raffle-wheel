/**
 * Raffle Logic
 */

export class RaffleManager {
  constructor() {
    this.items = []; // Array of { id: string, name: string, weight: number }
    this.reductionFactor = 0.5;
    this.maxDraws = 3;
    this.drawCounts = {}; // { name: count }
  }

  setMaxDraws(val) {
    this.maxDraws = parseInt(val) || 3;
  }

  /**
   * Initialize the list of names.
   * Each name instance gets a unique ID and an initial weight of 1.0.
   * @param {string[]} names 
   */
  setNames(names) {
    this.items = names.map((name, index) => ({
      id: `${name.toLowerCase()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.toLowerCase(),
      weight: 1.0
    }));
  }

  /**
   * Performs a weighted random selection.
   * @returns {Object|null} The selected item or null if empty.
   */
  pickWinner() {
    if (this.items.length === 0) return null;

    const totalWeight = this.items.reduce((sum, item) => sum + item.weight, 0);
    if (totalWeight === 0) return null;

    let random = Math.random() * totalWeight;

    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (random < item.weight) {
        return item;
      }
      random -= item.weight;
    }

    return this.items[this.items.length - 1];
  }

  /**
   * Removes the specific instance picked and reduces the weight of other instances of the same name.
   * If max draws reached, sets weight to 0 for all instances.
   * @param {string} pickedId 
   */
  handleSelection(pickedId) {
    const pickedItem = this.items.find(item => item.id === pickedId);
    if (!pickedItem) return;

    const pickedName = pickedItem.name;

    // 1. Increment draw count
    this.drawCounts[pickedName] = (this.drawCounts[pickedName] || 0) + 1;

    // 2. Remove the specific instance
    this.items = this.items.filter(item => item.id !== pickedId);

    // 3. Check if max draws reached
    if (this.drawCounts[pickedName] >= this.maxDraws) {
      // Set weight of ALL remaining instances of this name to 0
      this.items.forEach(item => {
        if (item.name === pickedName) {
          item.weight = 0;
        }
      });
    } else {
      // Reduce weight of remaining instances of the same name
      this.items.forEach(item => {
        if (item.name === pickedName) {
          item.weight *= this.reductionFactor;
        }
      });
    }
  }

  getItems() {
    return [...this.items];
  }
}
