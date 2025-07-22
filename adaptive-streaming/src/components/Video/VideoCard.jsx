import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

export default function VideoCard({ video, onDelete }) {
  const { darkMode } = useTheme();

  return (
    <div className={`rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02] ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <Link to={`/watch/${video.id}`}>
        <div className="relative pt-[56.25%] bg-gradient-to-br from-purple-500 to-blue-500">
          <img
            src={video.thumbnail || "/placeholder-thumbnail.jpg"}
            alt={video.title}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
            {video.duration || '00:00'}
          </div>
        </div>
      </Link>
      <div className={`p-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
        <Link to={`/watch/${video.id}`}>
          <h3 className="font-bold text-lg mb-1 line-clamp-2">{video.title}</h3>
        </Link>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{video.views} views</p>
        {onDelete && (
          <button
            onClick={() => onDelete(video.id)}
            className="mt-2 text-red-500 hover:text-red-700 text-sm font-medium"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}