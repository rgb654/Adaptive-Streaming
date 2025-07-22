import { storage } from "../config/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export const uploadVideo = async (file, quality, userId, videoId) => {
  const storageRef = ref(storage, `videos/${userId}/${videoId}/${quality}`);
  const uploadTask = uploadBytesResumable(storageRef, file);
  
  await uploadTask;
  
  return getDownloadURL(uploadTask.snapshot.ref);
};

export const deleteVideo = async (userId, videoId) => {
  // Delete all quality versions
  const qualities = ['360p', '720p', '1080p'];
  const deletePromises = qualities.map(quality => {
    const videoRef = ref(storage, `videos/${userId}/${videoId}/${quality}`);
    return deleteObject(videoRef).catch(error => {
      console.error(`Error deleting ${quality}:`, error);
    });
  });
  
  return Promise.all(deletePromises);
};