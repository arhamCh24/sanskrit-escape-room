export default class ScoreManager {
  constructor(startingScore = 0) {
    this.score = startingScore;
  }

  add(points) {
    this.score += points;
    return this.score;
  }

  subtract(points) {
    this.score = Math.max(0, this.score - points);
    return this.score;
  }

  getScore() {
    return this.score;
  }
}
