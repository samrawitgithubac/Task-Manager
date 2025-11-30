import React from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Home() {
  const { user, logout } = React.useContext(AuthContext);

  return (
    <div
      className="container"
      style={{
        maxWidth: "600px",
        margin: "3rem auto",
        textAlign: "center",
        animation: "fadeIn 1s ease-in-out",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          marginBottom: "2rem",
          animation: "scaleUp 1s ease-in-out",
        }}
      >
        Welcome to Task Manager
      </h1>

      {user ? (
        <div style={{ marginTop: "2rem" }}>
          <p style={{ fontSize: "1.2rem" }}>
            Hello, <strong>{user.name}</strong> ({user.role})
          </p>
          <button
            className="btn-primary"
            onClick={logout}
            style={{
              padding: "0.7rem 1.5rem",
              fontSize: "1rem",
              cursor: "pointer",
              borderRadius: "5px",
              marginTop: "1.5rem",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Logout
          </button>
        </div>
      ) : (
        <div style={{ marginTop: "2rem", fontSize: "1.1rem" }}>
          <Link
            to="/login"
            style={{
              marginRight: "1.5rem",
              textDecoration: "none",
              transition: "color 0.3s ease, transform 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Login
          </Link>
          <Link
            to="/register"
            style={{
              textDecoration: "none",
              transition: "color 0.3s ease, transform 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Register
          </Link>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleUp {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
