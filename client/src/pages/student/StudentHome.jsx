import { useState, useEffect } from "react";
import examService from "../../api/ExamService.js";
import AppConfig from "../../app.config.js";

function StudentHome({ user, onNavigate }) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    examService.getAllExams().then(data => {
      const activeExams = data.filter(
        e => e.status === AppConfig.examStatus.ACTIVE
      );
      setExams(activeExams);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="text-center mt-5">
      <div className="spinner-border text-primary"/>
    </div>
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">מבחנים זמינים</h2>
      {exams.length === 0 ? (
        <div className="alert alert-info">אין מבחנים זמינים כרגע</div>
      ) : (
        <div className="row">
          {exams.map(exam => (
            <div className="col-md-4 mb-3" key={exam.id}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{exam.title}</h5>
                  <p className="card-text text-muted">שאלות: {exam.questions.length}</p>
                  <p className="card-text text-muted">זמן: {exam.duration} דקות</p>
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => onNavigate("takeExam", exam.id)}
                  >
                    התחל מבחן
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentHome;