import React, { useState, useRef } from "react";
import axios from "axios";
import "./Upload.css";

function MediaUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [allMedia, setAllMedia] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [showMediaList, setShowMediaList] = useState(false);

  const fileInputRef = useRef(null); // <-- Ref for file input

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  };

  const fetchAllMedia = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/media/all", {
        headers: { "auth-token": localStorage.getItem("token") },
      });
      setAllMedia(res.data);
      // Removed the "Media list refreshed" toast
    } catch (error) {
      console.error("Failed to fetch media", error);
      addToast(
        "❌ Failed to fetch media: " +
          (error.response?.data?.error || error.message),
        "error"
      );
    }
  };

  const handleUpload = async () => {
    if (!file) {
      addToast("❌ Please select a file first!", "error");
      return;
    }

    setLoading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/media/upload",
        formData,
        {
          headers: { "auth-token": localStorage.getItem("token") },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percent);
          },
        }
      );

      // ✅ Upload success toast
      addToast(`✅ Uploaded File: ${res.data.filename || "View File"}`, "success");

      // Reset file input
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = null;

      setProgress(100);

      fetchAllMedia(); // still fetch media, but no toast

      setTimeout(() => setLoading(false), 500);
    } catch (error) {
      console.error("Upload failed", error);

      let msg = error.response?.data?.error || error.message;
      if (msg.includes("File size too large")) {
        const matches = msg.match(/Got (\d+)\. Maximum is (\d+)/);
        if (matches) {
          const gotMB = (parseInt(matches[1]) / (1024 * 1024)).toFixed(2);
          const maxMB = (parseInt(matches[2]) / (1024 * 1024)).toFixed(2);
          msg = `❌ Upload error: File size too large. Got ${gotMB} MB. Maximum is ${maxMB} MB.`;
        }
      }

      addToast(msg, "error");
      setLoading(false);
    }
  };

  const deleteMedia = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/media/delete/${id}`, {
        headers: { "auth-token": localStorage.getItem("token") },
      });

      setAllMedia(allMedia.filter((item) => item._id !== id));
      addToast("✅ File deleted", "success");
    } catch (error) {
      console.error("Failed to delete media", error);
      addToast(
        "❌ Failed to delete file: " +
          (error.response?.data?.error || error.message),
        "error"
      );
    }
  };

  return (
    <div className="upload-container">
      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            {toast.message}
          </div>
        ))}
      </div>

      {/* Loading bar */}
      {loading && <div className="loading-bar" style={{ width: `${progress}%` }}></div>}

      <input
        ref={fileInputRef}
        type="file"
        className="upload-input"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button className="upload-button" onClick={handleUpload}>
        Upload
      </button>

      {/* Show/Hide Uploaded Files */}
      <button
        className={`upload-button show-hide-btn ${showMediaList ? "active" : ""}`}
        onClick={() => {
          if (!showMediaList) fetchAllMedia();
          setShowMediaList(!showMediaList);
        }}
      >
        {showMediaList ? "Hide Uploaded Files" : "Show Uploaded Files"}
      </button>

      {showMediaList && allMedia.length > 0 && (
        <div className="media-list">
          <h3>📂 Uploaded Files</h3>
          {allMedia.map((media) => (
            <div key={media._id} className="media-item">
              <a href={media.url} target="_blank" rel="noreferrer">
                {media.filename}
              </a>
              <button
                className="delete-button"
                onClick={() => deleteMedia(media._id)}
              >
                ❌ Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MediaUpload;
