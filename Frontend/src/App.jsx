import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
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

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/login"
        element={
          <Login
            onSuccess={() => navigate("/dashboard")}
          />
        }
      />
      <Route
        path="/signup"
        element={
          <Signup
            onSuccess={() => navigate("/dashboard")}
          />
        }
      />
      <Route
        path="/dashboard"
        element={<Available />}
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
