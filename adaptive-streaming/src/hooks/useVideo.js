// src/hooks/useVideo.js
import { useContext } from "react";
import { VideoContext } from "../context/VideoContext";

/**
 * Custom hook to access video context
 * @returns {Object} Video context values
 * @throws {Error} If used outside VideoProvider
 */
export const useVideo = () => {
  const context = useContext(VideoContext);
  
  if (!context) {
    throw new Error("useVideo must be used within a VideoProvider");
  }
  
  return context;
};