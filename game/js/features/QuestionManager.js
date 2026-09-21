export default class QuestionManager {
  checkAnswer(question, answer) {
    if (!question) return true;

    return (
      String(answer).trim().toLowerCase() ===
      String(question.correctAnswer).trim().toLowerCase()
    );
  }
}
