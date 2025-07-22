import { useEffect, useState } from "react";
import { useVideo } from "../context/VideoContext";
import { useAuth } from "../hooks/useAuth";
import VideoCard from "../components/Video/VideoCard";
import UploadModal from "../components/Video/UploadModal";
import Layout from "../components/Layout/Layout";
import { useTheme } from "../context/ThemeContext";

export default function Dashboard() {
  const { videos, fetchUserVideos, deleteVideo } = useVideo();
  const { currentUser } = useAuth();
  const { darkMode } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetchUserVideos(currentUser.uid);
    }
  }, [currentUser, fetchUserVideos]);

  const handleDelete = (videoId, userId) => {
    if (currentUser && currentUser.uid === userId) {
      if (window.confirm("Are you sure you want to delete this video?")) {
        deleteVideo(videoId, userId);
      }
    }
  };

  return (
    <Layout>
      <div className={`container mx-auto px-4 py-6 min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
            Your Videos
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className={`px-4 py-2 rounded hover:bg-blue-600 transition-colors ${
              darkMode 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Upload Video
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {videos.map(video => (
            <VideoCard 
              key={video.id} 
              video={video}
              onDelete={() => handleDelete(video.id, video.userId)}
              darkMode={darkMode}
            />
          ))}
        </div>
        
        <UploadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          darkMode={darkMode}
        />
      </div>
    </Layout>
  );
}