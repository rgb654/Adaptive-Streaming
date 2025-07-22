import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";

export default function Sidebar() {
  const location = useLocation();
  const { currentUser } = useAuth();
  const { darkMode } = useTheme();

  if (!currentUser) return null;

  return (
    <aside className={`w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg hidden md:block`}>
      <div className="p-4">
        <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Adaptix</h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className={`block px-4 py-3 rounded-lg transition-all ${darkMode ? 
                  (location.pathname === "/" ? 'bg-purple-700 text-white' : 'text-gray-300 hover:bg-gray-700') : 
                  (location.pathname === "/" ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100')}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard"
                className={`block px-4 py-3 rounded-lg transition-all ${darkMode ? 
                  (location.pathname === "/dashboard" ? 'bg-purple-700 text-white' : 'text-gray-300 hover:bg-gray-700') : 
                  (location.pathname === "/dashboard" ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100')}`}
              >
                Your Videos
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}