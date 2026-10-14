import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import PredictPerformance from "./pages/PredictPerformance";
import UploadDataset from "./pages/UploadDataset";
import AIAssistant from "./pages/AIAssistant";
import StudentDetails from "./pages/StudentDetails";
import Predictions from "./pages/Predictions";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";

function ProtectedAIAssistant() {
  const navigate = useNavigate();

  const savedSettings =
    localStorage.getItem("eduaiSettings");

  let aiEnabled = true;

  if (savedSettings) {
    try {
      const settings = JSON.parse(savedSettings);

      aiEnabled =
        settings.aiAssistant ?? true;
    } catch (error) {
      console.error(
        "Error reading AI settings:",
        error
      );
    }
  }

  if (!aiEnabled) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <AIAssistant />;
}

function ProtectedRoute({ children }) {
  const user = localStorage.getItem("eduaiUser");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
function App() {
  return (
    <BrowserRouter>
      <Routes>

  {/* Public Route */}
  <Route path="/login" element={<Login />} />

  <Route path="/register" element={<Register />} />

  {/* Protected Routes */}
  <Route
    path="/"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />

  <Route
    path="/predict-performance"
    element={
      <ProtectedRoute>
        <PredictPerformance />
      </ProtectedRoute>
    }
  />

  <Route
    path="/upload-dataset"
    element={
      <ProtectedRoute>
        <UploadDataset />
      </ProtectedRoute>
    }
  />

  <Route
    path="/analytics"
    element={
      <ProtectedRoute>
        <Analytics />
      </ProtectedRoute>
    }
  />

  <Route
    path="/ai-assistant"
    element={
      <ProtectedRoute>
        <ProtectedAIAssistant />
      </ProtectedRoute>
    }
  />

  <Route
    path="/student-details/:index"
    element={
      <ProtectedRoute>
        <StudentDetails />
      </ProtectedRoute>
    }
  />

  <Route
    path="/predictions"
    element={
      <ProtectedRoute>
        <Predictions />
      </ProtectedRoute>
    }
  />

  <Route
    path="/reports"
    element={
      <ProtectedRoute>
        <Reports />
      </ProtectedRoute>
    }
  />

  <Route
    path="/profile"
    element={
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    }
  />

  <Route
    path="/settings"
    element={
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    }
  />

</Routes>
    </BrowserRouter>
  );
}

export default App;
