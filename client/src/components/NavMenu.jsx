import AppConfig from "../app.config.js";
import authService from "../api/AuthService.js";

function NavMenu({ user, onLogout, onNavigate, currentPage }) {
  const isTeacher = user?.role === AppConfig.roles.TEACHER;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <span className="navbar-brand fw-bold">
          {AppConfig.appName}
        </span>
        <div className="d-flex align-items-center gap-3">
          {isTeacher ? (
            <>
              <button
                className={`btn btn-${currentPage === "dashboard" ? "light" : "outline-light"} btn-sm`}
                onClick={() => onNavigate("dashboard")}
              >
                לוח בקרה
              </button>
              <button
                className={`btn btn-${currentPage === "createExam" ? "light" : "outline-light"} btn-sm`}
                onClick={() => onNavigate("createExam")}
              >
                יצירת מבחן
              </button>
              <button
                className={`btn btn-${currentPage === "manageExams" ? "light" : "outline-light"} btn-sm`}
                onClick={() => onNavigate("manageExams")}
              >
                ניהול מבחנים
              </button>
            </>
          ) : (
            <>
              <button
                className={`btn btn-${currentPage === "studentHome" ? "light" : "outline-light"} btn-sm`}
                onClick={() => onNavigate("studentHome")}
              >
                מבחנים זמינים
              </button>
              <button
                className={`btn btn-${currentPage === "myResults" ? "light" : "outline-light"} btn-sm`}
                onClick={() => onNavigate("myResults")}
              >
                הציונים שלי
              </button>
            </>
          )}
          <span className="text-white-50 small">{user?.name}</span>
          <button className="btn btn-danger btn-sm" onClick={onLogout}>
            התנתק
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavMenu;