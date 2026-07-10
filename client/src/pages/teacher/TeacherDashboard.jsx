import { useState, useEffect } from "react";
import examService from "../../api/ExamService.js";
import AppConfig from "../../app.config.js";

function TeacherDashboard({ user, onNavigate }) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    examService.getExamsByTeacher(user.id).then(data => {
      setExams(data);
      setLoading(false);
    });
  }, [user.id]);

  const handleStatusChange = (examId, newStatus) => {
    examService.changeStatus(examId, newStatus).then(updated => {
      setExams(prev => prev.map(e => e.id === updated.id ? updated : e));
    });
  };

  const getStatusBadge = (status) => {
    const colors = {
      [AppConfig.examStatus.DRAFT]: "secondary",
      [AppConfig.examStatus.ACTIVE]: "success",
      [AppConfig.examStatus.CLOSED]: "danger",
    };
    return colors[status] || "secondary";
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"/></div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>לוח בקרה - מורה</h2>
        <button className="btn btn-primary" onClick={() => onNavigate("createExam")}>
          + צור מבחן חדש
        </button>
      </div>
      {exams.length === 0 ? (
        <div className="alert alert-info">אין מבחנים עדיין. צור מבחן חדש!</div>
      ) : (
        <div className="row">
          {exams.map(exam => (
            <div className="col-md-4 mb-3" key={exam.id}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{exam.title}</h5>
                  <p className="card-text text-muted">
                    שאלות: {exam.questions.length} | זמן: {exam.duration} דקות
                  </p>
                  <span className={`badge bg-${getStatusBadge(exam.status)} mb-3`}>
                    {exam.status}
                  </span>
                  <div className="d-flex gap-2 flex-wrap">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => onNavigate("editExam", exam.id)}
                    >
                      ערוך
                    </button>
                    {exam.status === AppConfig.examStatus.DRAFT && (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleStatusChange(exam.id, AppConfig.examStatus.ACTIVE)}
                      >
                        פרסם
                      </button>
                    )}
                    {exam.status === AppConfig.examStatus.ACTIVE && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleStatusChange(exam.id, AppConfig.examStatus.CLOSED)}
                      >
                        סגור
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TeacherDashboard;