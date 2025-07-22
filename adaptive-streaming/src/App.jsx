import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { VideoProvider } from "./context/VideoContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Watch from "./pages/Watch";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import { ThemeProvider } from "./context/ThemeContext";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <VideoProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={
                <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
                />
              <Route path="/watch/:id" element={<Watch />} />
            </Routes>
          </VideoProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;