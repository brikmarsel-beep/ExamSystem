import { useState, useEffect } from "react";
import examService from "../../api/ExamService.js";

function TakeExam({ examId, user, onNavigate }) {
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    examService.getExamById(examId).then(data => {
      setExam(data);
      setLoading(false);
    });
  }, [examId]);

  const handleAnswer = (questionIndex, answerIndex) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: answerIndex }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length !== exam.questions.length) {
      alert("נא לענות על כל השאלות");
      return;
    }
    setSubmitting(true);
    const answersArray = exam.questions.map((_, i) => answers[i]);
    examService.submitExam(examId, user.id, answersArray).then(submission => {
      setResult(submission);
      setSubmitting(false);
    });
  };

  if (loading) return (
    <div className="text-center mt-5">
      <div className="spinner-border text-primary"/>
    </div>
  );

  if (result) return (
    <div className="container mt-5">
      <div className="card shadow p-4 text-center">
        <h2 className="mb-3">תוצאות המבחן</h2>
        <h1 className={`display-1 ${result.passed ? "text-success" : "text-danger"}`}>
          {result.score}%
        </h1>
        <p className="fs-4">
          {result.passed ? "🎉 עברת את המבחן!" : "😔 לא עברת את המבחן"}
        </p>
        <button className="btn btn-primary mt-3" onClick={() => onNavigate("studentHome")}>
          חזור למבחנים
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">{exam.title}</h2>
      <p className="text-muted">זמן: {exam.duration} דקות | שאלות: {exam.questions.length}</p>
      {exam.questions.map((q, i) => (
        <div className="card shadow-sm mb-3 p-3" key={q.id}>
          <h6>{i + 1}. {q.text}</h6>
          {q.options.map((opt, j) => (
            <div className="form-check mt-2" key={j}>
              <input
                type="radio"
                className="form-check-input"
                name={`question-${i}`}
                checked={answers[i] === j}
                onChange={() => handleAnswer(i, j)}
              />
              <label className="form-check-label">{opt}</label>
            </div>
          ))}
        </div>
      ))}
      <button
        className="btn btn-success w-100 mb-4"
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? "מגיש..." : "הגש מבחן"}
      </button>
    </div>
  );
}

export default TakeExam;