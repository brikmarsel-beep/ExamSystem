import { useState } from "react";
import examService from "../../api/ExamService.js";

function CreateExam({ user, onNavigate }) {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(30);
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correct, setCorrect] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleAddQuestion = () => {
    if (!questionText || options.some(o => !o)) return;
    setQuestions([...questions, { text: questionText, options, correct }]);
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrect(0);
  };

  const handleCreateExam = () => {
    if (!title || questions.length === 0) return;
    setLoading(true);
    examService.createExam(title, user.id, duration).then(exam => {
      const promises = questions.map(q => examService.addQuestion(exam.id, q));
      Promise.all(promises).then(() => {
        setLoading(false);
        onNavigate("dashboard");
      });
    });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">יצירת מבחן חדש</h2>
      <div className="card shadow-sm p-4 mb-4">
        <h5>פרטי המבחן</h5>
        <div className="mb-3">
          <label className="form-label">שם המבחן</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="לדוגמה: מבחן JavaScript"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">משך המבחן (דקות)</label>
          <input
            type="number"
            className="form-control"
            value={duration}
            onChange={e => setDuration(parseInt(e.target.value))}
          />
        </div>
      </div>
      <div className="card shadow-sm p-4 mb-4">
        <h5>הוספת שאלה</h5>
        <div className="mb-3">
          <label className="form-label">טקסט השאלה</label>
          <input
            type="text"
            className="form-control"
            value={questionText}
            onChange={e => setQuestionText(e.target.value)}
            placeholder="מה השאלה?"
          />
        </div>
        {options.map((opt, i) => (
          <div className="mb-2" key={i}>
            <div className="input-group">
              <div className="input-group-text">
                <input
                  type="radio"
                  name="correct"
                  checked={correct === i}
                  onChange={() => setCorrect(i)}
                />
              </div>
              <input
                type="text"
                className="form-control"
                value={opt}
                onChange={e => {
                  const newOptions = [...options];
                  newOptions[i] = e.target.value;
                  setOptions(newOptions);
                }}
                placeholder={`תשובה ${i + 1}`}
              />
            </div>
          </div>
        ))}
        <button className="btn btn-outline-primary mt-2" onClick={handleAddQuestion}>
          + הוסף שאלה
        </button>
      </div>
      {questions.length > 0 && (
        <div className="card shadow-sm p-4 mb-4">
          <h5>שאלות שנוספו ({questions.length})</h5>
          {questions.map((q, i) => (
            <div key={i} className="alert alert-light">
              {i + 1}. {q.text}
            </div>
          ))}
        </div>
      )}
      <button
        className="btn btn-primary w-100"
        onClick={handleCreateExam}
        disabled={loading || !title || questions.length === 0}
      >
        {loading ? "יוצר מבחן..." : "צור מבחן"}
      </button>
    </div>
  );
}

export default CreateExam;