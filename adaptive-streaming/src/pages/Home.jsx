import { useEffect } from "react";
import { useVideo } from "../context/VideoContext";
import VideoCard from "../components/Video/VideoCard";
import Layout from "../components/Layout/Layout";
import { useTheme } from "../context/ThemeContext";

export default function Home() {
  const { videos, fetchAllVideos } = useVideo();
  const { darkMode } = useTheme(); // Destructure darkMode from useTheme

  useEffect(() => {
    fetchAllVideos();
  }, [fetchAllVideos]);

  return (
    <Layout>
      <div className={`container mx-auto px-4 py-6 rounded ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
        <h1 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-black'}`}>
          Latest Videos
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </Layout>
  );
}