import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh'}}>
      <div className="simple-box compact" style={{ width: 420, maxWidth: '100%' }}>
        <form onSubmit={handleSubmit}>
          <h1 style={{marginBottom:12, textAlign:'center'}}>Login</h1>
          {error && <div className="form-error" role="alert">{error}</div>}

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading || !email || !password}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div style={{marginTop:20, textAlign:'center'}}>
          <Link to="/register">Create account</Link> &nbsp;|&nbsp; <Link to="/forgot">Forgot password?</Link>
        </div>
      </div>
    </div>
  );
}
