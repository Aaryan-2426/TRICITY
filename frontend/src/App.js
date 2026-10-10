import "./App.css";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router-dom";
import MentorDashboard from "./pages/MentorDashboard";
import LandingPage from "./pages/landing";
import Authentication from "./pages/authentication";
import { AuthProvider } from "./contexts/AuthContext";
import VideoMeetComponent from "./pages/VideoMeet";
import HomeComponent from "./pages/home";
import MockMateDashboard from "./pages/MockMateDashboard";
import History from "./pages/history";

function RoleBasedHome() {
  const role = localStorage.getItem("role");

  if (!localStorage.getItem("token")) {
    return <Navigate to="/auth" replace />;
  }

  if (role === "mentor") {
    return <Navigate to="/mentor-dashboard" replace />;
  }

  return <MockMateDashboard />;
}

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Authentication />} />

            <Route path="/home" element={<RoleBasedHome />} />

            <Route path="/history" element={<History />} />
            <Route path="/mentor-dashboard" element={<MentorDashboard />} />
            <Route
              path="/interview/:bookingId"
              element={<VideoMeetComponent />}
            />
            <Route path="/:url" element={<VideoMeetComponent />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
