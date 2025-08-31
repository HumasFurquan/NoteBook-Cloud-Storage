import React, { useState } from "react";
import axios from "axios";
import "./Media.css";

const Media = () => {
  const [file, setFile] = useState(null);
  const [mediaUrl, setMediaUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle file select
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Upload to Cloudinary
  const handleUpload = async () => {
    if (!file) return alert("Please select a file first!");

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "your_unsigned_preset"); // replace with your preset name
    data.append("cloud_name", "your_cloud_name"); // replace with your cloud name

    try {
      setLoading(true);
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/your_cloud_name/auto/upload`,
        data
      );
      setMediaUrl(res.data.secure_url);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="media-container">
      <h2>Upload Media</h2>
      
      <input type="file" onChange={handleFileChange} />
      <button className="upload-btn" onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {mediaUrl && (
        <div className="media-preview">
          <h3>Preview:</h3>

          {/* Show based on file type */}
          {file.type.startsWith("image/") && (
            <img src={mediaUrl} alt="Uploaded" className="preview-img" />
          )}

          {file.type.startsWith("video/") && (
            <video controls className="preview-video">
              <source src={mediaUrl} type={file.type} />
            </video>
          )}

          {file.type === "application/pdf" && (
            <iframe src={mediaUrl} title="PDF" className="preview-pdf"></iframe>
          )}
        </div>
      )}
    </div>
  );
};

export default Media;
