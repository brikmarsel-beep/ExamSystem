import { useState, useEffect } from "react";
import examService from "../../api/ExamService.js";

function MyResults({ user }) {
  const [submissions, setSubmissions] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      examService.getSubmissionsByStudent(user.id),
      examService.getAllExams(),
    ]).then(([subs, allExams]) => {
      setSubmissions(subs);
      setExams(allExams);
      setLoading(false);
    });
  }, [user.id]);

  const getExamTitle = (examId) => {
    const exam = exams.find(e => e.id === examId);
    return exam ? exam.title : "מבחן לא ידוע";
  };

  if (loading) return (
    <div className="text-center mt-5">
      <div className="spinner-border text-primary"/>
    </div>
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">הציונים שלי</h2>
      {submissions.length === 0 ? (
        <div className="alert alert-info">לא הגשת מבחנים עדיין</div>
      ) : (
        <div className="row">
          {submissions.map(sub => (
            <div className="col-md-4 mb-3" key={sub.id}>
              <div className="card shadow-sm h-100">
                <div className="card-body text-center">
                  <h5 className="card-title">{getExamTitle(sub.examId)}</h5>
                  <h1 className={`display-4 ${sub.passed ? "text-success" : "text-danger"}`}>
                    {sub.score}%
                  </h1>
                  <span className={`badge bg-${sub.passed ? "success" : "danger"}`}>
                    {sub.passed ? "עבר" : "נכשל"}
                  </span>
                  <p className="text-muted mt-2 small">
                    {new Date(sub.submittedAt).toLocaleDateString("he-IL")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyResults;