import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { logout } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

export default function Header() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          Adaptix
        </Link>
        
        <div className="flex items-center space-x-6">
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-100 text-gray-700'}`}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          
          {currentUser ? (
            <>
              <Link to="/dashboard" className={`font-medium ${darkMode ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-blue-600'}`}>
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`font-medium ${darkMode ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-blue-600'}`}>
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}