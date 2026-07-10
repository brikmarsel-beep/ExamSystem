import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import authService from "./api/AuthService.js";
import AppConfig from "./app.config.js";
import NavMenu from "./components/NavMenu.jsx";
import Notification from "./components/Notification.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import TeacherDashboard from "./pages/teacher/TeacherDashboard.jsx";
import CreateExam from "./pages/teacher/CreateExam.jsx";
import EditExam from "./pages/teacher/EditExam.jsx";
import StudentHome from "./pages/student/StudentHome.jsx";
import TakeExam from "./pages/student/TakeExam.jsx";
import MyResults from "./pages/student/MyResults.jsx";

function App() {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [page, setPage] = useState("dashboard");
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [authPage, setAuthPage] = useState("login");

  const handleLogin = (loggedUser) => {
    setUser(loggedUser);
    setPage(loggedUser.role === AppConfig.roles.TEACHER ? "dashboard" : "studentHome");
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setAuthPage("login");
  };

  const handleNavigate = (newPage, examId = null) => {
    setPage(newPage);
    if (examId) setSelectedExamId(examId);
  };

  if (!user) {
    return (
      <>
        <Notification />
        {authPage === "login" ? (
          <Login onLogin={handleLogin} onGoToRegister={() => setAuthPage("register")} />
        ) : (
          <Register onRegister={handleLogin} onGoToLogin={() => setAuthPage("login")} />
        )}
      </>
    );
  }

  const renderPage = () => {
    if (user.role === AppConfig.roles.TEACHER) {
      switch (page) {
        case "dashboard": return <TeacherDashboard user={user} onNavigate={handleNavigate} />;
        case "createExam": return <CreateExam user={user} onNavigate={handleNavigate} />;
        case "editExam": return <EditExam examId={selectedExamId} onNavigate={handleNavigate} />;
        default: return <TeacherDashboard user={user} onNavigate={handleNavigate} />;
      }
    } else {
      switch (page) {
        case "studentHome": return <StudentHome user={user} onNavigate={handleNavigate} />;
        case "takeExam": return <TakeExam examId={selectedExamId} user={user} onNavigate={handleNavigate} />;
        case "myResults": return <MyResults user={user} />;
        default: return <StudentHome user={user} onNavigate={handleNavigate} />;
      }
    }
  };

  return (
    <>
      <Notification />
      <NavMenu user={user} onLogout={handleLogout} onNavigate={handleNavigate} currentPage={page} />
      {renderPage()}
    </>
  );
}

export default App;