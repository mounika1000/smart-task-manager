import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { getToken } from "./utils/auth";

const THEME_KEY = "smart_task_theme";

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || "light");

  useEffect(() => {
    // Persist theme and apply it globally.
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((previous) => (previous === "light" ? "dark" : "light"));
  };

  return (
    <div className={`app theme-${theme}`}>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={getToken() ? "/dashboard" : "/login"} replace />}
        />
        <Route
          path="/signup"
          element={<SignupPage theme={theme} onToggleTheme={toggleTheme} />}
        />
        <Route
          path="/login"
          element={<LoginPage theme={theme} onToggleTheme={toggleTheme} />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage theme={theme} onToggleTheme={toggleTheme} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
