import { useState } from "react";
import { useVideo } from "../../context/VideoContext";
import { useAuth } from "../../hooks/useAuth";

export default function UploadModal({ isOpen, onClose, darkMode }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState({
    "360p": null,
    "720p": null,
    "1080p": null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const { uploadVideo } = useVideo();
  const { currentUser } = useAuth();

  const handleFileChange = (quality) => (e) => {
    setFiles({
      ...files,
      [quality]: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !files["360p"] || !files["720p"] || !files["1080p"]) {
      setError("Please fill all fields and upload all quality versions");
      return;
    }

    try {
      setIsUploading(true);
      setError("");
      
      const videoData = {
        title,
        description,
        userId: currentUser.uid,
        views: 0,
        createdAt: new Date().toISOString(),
      };

      await uploadVideo(videoData, files);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div 
        className={`relative rounded-xl shadow-xl w-full max-w-md ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}">
          <h3 className="text-xl font-semibold">
            Upload New Video
          </h3>
          <button
            onClick={onClose}
            className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {error && (
            <div className={`p-3 rounded-lg flex items-start gap-2 text-sm ${darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title*</label>
              <input
                type="text"
                className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-400'} focus:ring-1 focus:outline-none transition`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-400'} focus:ring-1 focus:outline-none transition`}
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              {["360p", "720p", "1080p"].map((quality) => (
                <div key={quality}>
                  <label className="block text-sm font-medium mb-1">{quality} Version*</label>
                  <label className={`flex flex-col items-center justify-center w-full p-3 border-2 border-dashed rounded-lg cursor-pointer text-center text-sm ${darkMode ? 'border-gray-600 hover:border-blue-500 bg-gray-700/50' : 'border-gray-300 hover:border-blue-400 bg-gray-50'} transition-colors`}>
                    {files[quality] ? (
                      <span className="text-blue-500 font-medium">{files[quality].name}</span>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span>Click to upload</span>
                      </>
                    )}
                    <input 
                      type="file" 
                      accept="video/*" 
                      onChange={handleFileChange(quality)} 
                      className="hidden" 
                      required 
                    />
                  </label>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 text-sm rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-70 transition-colors flex items-center gap-1.5`}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Upload
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}