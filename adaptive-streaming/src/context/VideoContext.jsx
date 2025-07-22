
import { createContext, useContext, useState } from "react";
import {
  addVideo as addVideoService,
  getVideo as getVideoService,
  updateVideoViews as updateVideoViewsService,
  deleteVideoFromFirestore as deleteVideoFromFirestoreService,
  getUserVideos as getUserVideosService,
  getAllVideos as getAllVideosService,
  updateVideoQualities
} from "../services/firestore";
import { uploadVideo as uploadVideoStorage, deleteVideo as deleteVideoStorage } from "../services/storage";

const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadVideo = async (videoData, files) => {
  try {
    // 1. First create the video document
    const videoId = await addVideoService({
      title: videoData.title,
      description: videoData.description,
      userId: videoData.userId,
      thumbnail: '' // You can add thumbnail later
    });

    // 2. Upload all quality versions
    const uploadTasks = Object.entries(files).map(async ([quality, file]) => {
      const url = await uploadVideoStorage(file, quality, videoData.userId, videoId);
      await updateVideoQualities(videoId, quality, url);
      return { quality, url };
    });

    await Promise.all(uploadTasks);
    
    return videoId;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};

  const fetchVideo = async (videoId) => {
    const video = await getVideoService(videoId);
    setCurrentVideo(video);
    return video;
  };

  const incrementViews = async (videoId) => {
    await updateVideoViewsService(videoId);
  };

  const deleteVideo = async (videoId, userId) => {
    await deleteVideoStorage(userId, videoId);
    await deleteVideoFromFirestoreService(videoId);
    setVideos(videos.filter(video => video.id !== videoId));
  };

  const fetchUserVideos = async (userId) => {
    const userVideos = await getUserVideosService(userId);
    setVideos(userVideos);
    return userVideos;
  };

  const fetchAllVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const allVideos = await getAllVideosService();
      setVideos(allVideos);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <VideoContext.Provider
      value={{
        videos,
        currentVideo,
        uploadVideo,
        fetchVideo,
        incrementViews,
        deleteVideo,
        fetchUserVideos,
        fetchAllVideos,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => {
  return useContext(VideoContext);
};