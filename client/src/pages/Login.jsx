import { useState } from "react";
import authService from "../api/AuthService.js";

function Login({ onLogin, onGoToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      setError("נא למלא את כל השדות");
      return;
    }
    setLoading(true);
    setError("");
    authService.login(email, password)
      .then(user => {
        setLoading(false);
        onLogin(user);
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
            <h3 className="text-center mb-4 text-primary">התחברות</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="mb-3">
              <label className="form-label">אימייל</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="teacher@test.com"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">סיסמה</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="1234"
              />
            </div>
            <button
              className="btn btn-primary w-100 mb-3"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "מתחבר..." : "התחבר"}
            </button>
            <p className="text-center mb-0">
              אין לך חשבון?{" "}
              <span
                className="text-primary"
                style={{ cursor: "pointer" }}
                onClick={onGoToRegister}
              >
                הירשם כאן
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;