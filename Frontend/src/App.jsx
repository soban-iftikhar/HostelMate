import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Activity from "./Pages/Activity";
import History from "./Pages/History";
import Leaderboard from "./Pages/Leaderboard";
import Available, { AvailableList } from "./Pages/AvailableFavors";
import Privacy from "./Pages/Privacy";
import CreateTask from "./Pages/CreateTask";

function App() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      <Route
        path="/login"
        element={
          user ? <Navigate to="/dashboard" replace /> : <Login onSuccess={() => navigate("/dashboard")} />
        }
      />
      <Route
        path="/signup"
        element={
          user ? <Navigate to="/dashboard" replace /> : <Signup onSuccess={() => navigate("/dashboard")} />
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Available />
          </ProtectedRoute>
        }
      >
        <Route index element={<AvailableList />} />
        <Route path="activity" element={<Activity />} />
        <Route path="create-task" element={<CreateTask />} />
        <Route path="history" element={<History />} />
        <Route path="leaderboard" element={<Leaderboard />} />
      </Route>
      <Route path="/privacy" element={<Privacy />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
