import { useState } from "react";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState("login");

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleSignupSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthView("login");
  };

  if (!isAuthenticated) {
    return authView === "login" ? (
      <Login
        onSuccess={handleLoginSuccess}
        onSwitchToSignup={() => setAuthView("signup")}
      />
    ) : (
      <Signup
        onSuccess={handleSignupSuccess}
        onSwitchToLogin={() => setAuthView("login")}
      />
    );
  }

  return <Dashboard onLogout={handleLogout} />;
}

export default App;
