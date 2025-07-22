// Login.jsx
import { useState } from "react";
import { login } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { darkMode } = useTheme();

  if (currentUser) {
    navigate("/");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
      <div className={`p-8 rounded-2xl shadow-xl w-full max-w-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Welcome to Adaptix
          </h2>
          <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Stream videos seamlessly</p>
        </div>
        
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 
                'bg-gray-700 border-gray-600 text-white' : 
                'bg-white border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 
                'bg-gray-700 border-gray-600 text-white' : 
                'bg-white border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-3 px-4 rounded-lg hover:opacity-90 transition-all font-medium"
          >
            Login
          </button>
        </form>
        <p className={`mt-6 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}