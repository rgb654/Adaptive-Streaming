import Header from "./Header";
import Sidebar from "./Sidebar";
import { useTheme } from "../../context/ThemeContext";

export default function Layout({ children }) {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <div className={`flex min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}