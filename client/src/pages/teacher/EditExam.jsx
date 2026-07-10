import { useState, useEffect } from "react";
import examService from "../../api/ExamService.js";
import AppConfig from "../../app.config.js";

function EditExam({ examId, onNavigate }) {
  const [exam, setExam] = useState(null);
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    examService.getExamById(examId).then(data => {
      setExam(data);
      setTitle(data.title);
      setDuration(data.duration);
      setLoading(false);
    });
  }, [examId]);

  const handleSave = () => {
    setSaving(true);
    examService.updateExam(examId, { title, duration }).then(() => {
      setSaving(false);
      onNavigate("dashboard");
    });
  };

  if (loading) return (
    <div className="text-center mt-5">
      <div className="spinner-border text-primary"/>
    </div>
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">עריכת מבחן</h2>
      <div className="card shadow-sm p-4 mb-4">
        <div className="mb-3">
          <label className="form-label">שם המבחן</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={e => setTitle(e.target.value)}
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
        <div className="mb-3">
          <label className="form-label">סטטוס נוכחי</label>
          <span className={`badge bg-${
            exam.status === AppConfig.examStatus.ACTIVE ? "success" :
            exam.status === AppConfig.examStatus.CLOSED ? "danger" : "secondary"
          } ms-2 fs-6`}>
            {exam.status}
          </span>
        </div>
        <h5 className="mt-3">שאלות ({exam.questions.length})</h5>
        {exam.questions.map((q, i) => (
          <div key={i} className="alert alert-light">
            <strong>{i + 1}. {q.text}</strong>
            <ul className="mt-2 mb-0">
              {q.options.map((opt, j) => (
                <li key={j} className={j === q.correct ? "text-success fw-bold" : ""}>
                  {opt} {j === q.correct ? "✓" : ""}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="d-flex gap-2">
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "שומר..." : "שמור שינויים"}
        </button>
        <button className="btn btn-outline-secondary" onClick={() => onNavigate("dashboard")}>
          ביטול
        </button>
      </div>
    </div>
  );
}

export default EditExam;