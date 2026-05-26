import { useState } from "react";
import authService from "../api/AuthService.js";
import AppConfig from "../app.config.js";

function Register({ onRegister, onGoToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(AppConfig.roles.STUDENT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = () => {
    if (!name || !email || !password) {
      setError("נא למלא את כל השדות");
      return;
    }
    setLoading(true);
    setError("");
    authService.register(name, email, password, role)
      .then(user => {
        setLoading(false);
        onRegister(user);
      })
      .catch(err => {
        setLoading(false);
        setError(err.message);
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card shadow p-4">
            <h3 className="text-center mb-4 text-primary">הרשמה</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="mb-3">
              <label className="form-label">שם מלא</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="ישראל ישראלי"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">אימייל</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@email.com"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">סיסמה</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="בחר סיסמה"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">תפקיד</label>
              <select
                className="form-select"
                value={role}
                onChange={e => setRole(e.target.value)}
              >
                <option value={AppConfig.roles.STUDENT}>סטודנט</option>
                <option value={AppConfig.roles.TEACHER}>מורה</option>
              </select>
            </div>
            <button
              className="btn btn-primary w-100 mb-3"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? "נרשם..." : "הירשם"}
            </button>
            <p className="text-center mb-0">
              כבר יש לך חשבון?{" "}
              <span
                className="text-primary"
                style={{ cursor: "pointer" }}
                onClick={onGoToLogin}
              >
                התחבר כאן
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;