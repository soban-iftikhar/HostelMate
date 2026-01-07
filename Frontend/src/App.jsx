import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Activity from "./Pages/Activity";
import Leaderboard from "./Pages/Leaderboard";
import Available from "./Pages/Available";

function App() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/login"
        element={
          <Login
            onSuccess={() => navigate("/dashboard")}
            onSwitchToSignup={() => navigate("/signup")}
          />
        }
      />
      <Route
        path="/signup"
        element={
          <Signup
            onSuccess={() => navigate("/dashboard")}
            onSwitchToLogin={() => navigate("/login")}
          />
        }
      />
      <Route
        path="/dashboard"
        element={<Dashboard onLogout={() => navigate("/login")} />}
      >
        <Route index element={<Available />} />
        <Route path="activity" element={<Activity />} />
        <Route path="leaderboard" element={<Leaderboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
