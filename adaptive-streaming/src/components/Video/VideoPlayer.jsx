import React, { useState, useEffect, useRef } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../config/firebase';
import { useTheme } from '../../context/ThemeContext';

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const [bandwidth, setBandwidth] = useState(null);
  const [currentQuality, setCurrentQuality] = useState('auto');
  const [networkStatus, setNetworkStatus] = useState('Checking network...');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playerError, setPlayerError] = useState(null);
  const bandwidthTestInterval = useRef(null);
  const currentTimeRef = useRef(0);
  const isSwitchingRef = useRef(false);
  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'videos'));
        const videosData = [];
        
        for (const doc of querySnapshot.docs) {
          const videoData = doc.data();
          const qualities = {};
          
          for (const [quality, path] of Object.entries(videoData.qualities)) {
            try {
              const storageRef = ref(storage, path);
              qualities[quality] = await getDownloadURL(storageRef);
            } catch (error) {
              console.error(`Error getting URL for ${quality}:`, error);
            }
          }
          
          videosData.push({
            id: doc.id,
            ...videoData,
            qualities
          });
        }
        
        setVideos(videosData);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setPlayerError('Failed to load videos');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();

    return () => {
      if (bandwidthTestInterval.current) {
        clearInterval(bandwidthTestInterval.current);
      }
    };
  }, []);

  // Bandwidth test
  const measureBandwidth = async () => {
    try {
      const testFileRef = ref(storage, 'test-files/1mb-test-file.dat');
      const testFileUrl = await getDownloadURL(testFileRef);
      
      const startTime = performance.now();
      const response = await fetch(testFileUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const blob = await response.blob();
      const duration = (performance.now() - startTime) / 1000;
      
      const speed = (blob.size * 8) / duration / (1024 * 1024);
      setBandwidth(speed);
      setNetworkStatus(`Network: ${speed.toFixed(2)} Mbps`);
      return speed;
    } catch (error) {
      console.error('Bandwidth test failed:', error);
      setNetworkStatus('Network test failed - using medium quality');
      return 2;
    }
  };

  const startBandwidthMonitoring = () => {
    if (bandwidthTestInterval.current) {
      clearInterval(bandwidthTestInterval.current);
    }

    measureBandwidth().then(speed => {
      const selectedUrl = selectQuality(speed);
      initPlayer(selectedUrl);
    });

    bandwidthTestInterval.current = setInterval(async () => {
      const speed = await measureBandwidth();
      const selectedUrl = selectQuality(speed);
      if (selectedUrl !== videoRef.current?.src && !isSwitchingRef.current) {
        switchQuality(selectedUrl);
      }
    }, 5000);
  };

  // Smooth quality switching
  const switchQuality = (newUrl) => {
    if (!videoRef.current || isSwitchingRef.current) return;

    isSwitchingRef.current = true;
    currentTimeRef.current = videoRef.current.currentTime;
    const wasPaused = videoRef.current.paused;

    console.log(`Switching to ${newUrl} at ${currentTimeRef.current}s`);
    
    videoRef.current.src = newUrl;
    videoRef.current.currentTime = currentTimeRef.current;
    
    videoRef.current.addEventListener('canplay', () => {
      if (!wasPaused) {
        videoRef.current.play().catch(e => {
          console.log('Autoplay blocked after quality switch');
        });
      }
      isSwitchingRef.current = false;
    }, { once: true });
  };

  // Initialize player
  const initPlayer = (videoUrl) => {
    if (!videoRef.current) return;

    videoRef.current.src = videoUrl;
    videoRef.current.load();
    
    videoRef.current.addEventListener('loadedmetadata', () => {
      console.log('Video metadata loaded');
    });

    videoRef.current.addEventListener('error', (e) => {
      console.error('Video error:', videoRef.current.error);
      setPlayerError('Failed to load video');
    });
  };

  // Auto-select quality based on bandwidth
  const selectQuality = (speed) => {
    if (!videos.length) return null;

    const video = videos[0];
    const { qualities } = video;
    let selectedQuality;

    if (speed > 11 && qualities['1080p']) {
      selectedQuality = qualities['1080p'];
      setCurrentQuality('1080p');
    } else if (speed > 6 && qualities['720p']) {
      selectedQuality = qualities['720p'];
      setCurrentQuality('720p');
    } else if (qualities['360p']) {
      selectedQuality = qualities['360p'];
      setCurrentQuality('360p');
    } else {
      selectedQuality = Object.values(qualities)[0];
      setCurrentQuality(Object.keys(qualities)[0] || 'unknown');
    }

    return selectedQuality;
  };

  useEffect(() => {
    if (loading || !videos.length) return;
    startBandwidthMonitoring();
  }, [loading, videos]);

  if (loading) return <div className="p-4 text-center">Loading videos...</div>;
  if (!videos.length) return <div className="p-4 text-center">No videos available</div>;
  if (playerError) return <div className="p-4 text-center text-red-500">{playerError}</div>;


return (
  <div className="max-w-6xl mx-auto">
    <div className="relative rounded-xl overflow-hidden shadow-2xl">
      <video
        ref={videoRef}
        controls
        className="w-full aspect-video bg-black"
        playsInline
      />
    </div>
    
    <div className={`mt-6 p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <div className="flex justify-between items-start">
        <div>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {videos[0]?.title || 'Loading...'}
          </h2>
          <div className="flex items-center mt-2 space-x-4">
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {videos[0]?.views || 0} views
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              darkMode ? 'bg-gray-700 text-purple-400' : 'bg-purple-100 text-purple-600'
            }`}>
              {currentQuality.toUpperCase()}
            </span>
          </div>
        </div>
        
        <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <p className="text-sm font-medium">
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Network:</span>{' '}
            <span className="font-bold text-purple-600">
              {bandwidth ? `${bandwidth.toFixed(2)} Mbps` : 'Testing...'}
            </span>
          </p>
        </div>
      </div>
      
      <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {videos[0]?.description || 'No description available'}
      </p>
    </div>
  </div>
);
};

export default VideoPlayer;