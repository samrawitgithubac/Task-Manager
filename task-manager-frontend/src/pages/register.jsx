import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await register(name, email, password, role);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{display:'flex', alignItems:'center', justifyContent:'center', minHeight:'70vh'}}>
      <div className="simple-box compact" style={{ width: 420, maxWidth: '100%' }}>
        <form onSubmit={handleSubmit}>
          <h1 style={{marginBottom:12, textAlign:'center'}}>Register</h1>
          {error && <div className="form-error" role="alert">{error}</div>}

          <div className="form-group">
            <label htmlFor="name" className="form-label">Name</label>
            <input id="name" name="name" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input id="email" name="email" type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input id="password" name="password" type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <div className="form-group">
            <label htmlFor="role" className="form-label">Role</label>
            <select id="role" name="role" className="form-input" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="submit-btn" disabled={loading || !name || !email || !password}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <div style={{marginTop:12, textAlign:'center'}}>
          <Link to="/login">Already have an account?</Link> &nbsp;|&nbsp; <Link to="/">Back</Link>
        </div>
      </div>
    </div>
  );
}
