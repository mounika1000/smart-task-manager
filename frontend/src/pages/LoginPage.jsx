import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { saveAuth } from "../utils/auth";

function LoginPage({ theme, onToggleTheme }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axiosClient.post("/auth/login", formData);
      const { token, name, email } = response.data;
      saveAuth(token, { name, email });
      navigate("/dashboard");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Invalid credentials. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrap">
      <div className="card">
        <div className="header-row">
          <h2>Login</h2>
          <button type="button" className="theme-btn" onClick={onToggleTheme}>
            {theme === "light" ? "Dark" : "Light"} Mode
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="helper-text">
          New user? <Link to="/signup">Create account</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
