import { db } from "../config/firebase";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  increment,
} from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";

// Modified addVideo function
export const addVideo = async (videoData) => {
  const docRef = await addDoc(collection(db, "videos"), {
    ...videoData,
    qualities: { // Store all quality versions under one document
      '360p': '', // Will be updated with URLs
      '720p': '',
      '1080p': ''
    },
    createdAt: serverTimestamp(),
    views: 0
  });
  return docRef.id;
};

// Update video qualities after upload
export const updateVideoQualities = async (videoId, quality, url) => {
  const videoRef = doc(db, "videos", videoId);
  await updateDoc(videoRef, {
    [`qualities.${quality}`]: url
  });
};

export const getVideo = async (videoId) => {
  const docRef = doc(db, "videos", videoId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const updateVideoViews = async (videoId) => {
  const videoRef = doc(db, "videos", videoId);
  await updateDoc(videoRef, {
    views: increment(1),
  });
};

export const deleteVideoFromFirestore = async (videoId) => {
  await deleteDoc(doc(db, "videos", videoId));
};

export const getUserVideos = async (userId) => {
  const q = query(collection(db, "videos"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getAllVideos = async () => {
  const querySnapshot = await getDocs(collection(db, "videos"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};