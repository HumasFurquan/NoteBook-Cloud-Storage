import React, { useState } from "react";
import "./Upload.css";

function MediaUpload() {
  const [file, setFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [allMedia, setAllMedia] = useState([]); // store all uploaded files

  // Upload file
  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setProgress(30);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/api/media/upload", {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
        body: formData,
      });

      setProgress(70);

      const data = await res.json();
      setUploadedUrl(data.url);

      setProgress(100);
      setTimeout(() => setLoading(false), 500);
    } catch (error) {
      console.error("Upload failed", error);
      setLoading(false);
    }
  };

  // Fetch all uploaded files
  const fetchAllMedia = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/media/all", {
        method: "GET",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      });
      const data = await res.json();
      setAllMedia(data);
    } catch (error) {
      console.error("Failed to fetch media", error);
    }
  };

  // Delete a file
  const deleteMedia = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/media/delete/${id}`, {
        method: "DELETE",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      });

      // remove deleted file from UI
      setAllMedia(allMedia.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Failed to delete media", error);
    }
  };

  return (
    <div className="upload-container">
      {/* Loading bar */}
      {loading && (
        <div
          className="loading-bar"
          style={{ width: `${progress}%` }}
        ></div>
      )}

      <input
        type="file"
        className="upload-input"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button className="upload-button" onClick={handleUpload}>
        Upload
      </button>

      {uploadedUrl && (
        <div className="upload-result">
          <p>✅ Uploaded File:</p>
          <a
            href={uploadedUrl}
            target="_blank"
            rel="noreferrer"
          >
            {file?.name}
          </a>
        </div>
      )}

      {/* Button to show all files */}
      <button className="upload-button" onClick={fetchAllMedia}>
        Show Uploaded Files
      </button>

      {/* Show all uploaded files */}
      {allMedia.length > 0 && (
        <div className="media-list">
          <h3>📂 Uploaded Files</h3>
          {allMedia.map((media) => (
            <div key={media._id} className="media-item">
              <a
                href={media.url}
                target="_blank"
                rel="noreferrer"
              >
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
