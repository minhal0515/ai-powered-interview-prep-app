import { Link } from "react-router-dom";
import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("resume");
  const [message, setMessage] = useState("");
  const [uploads, setUploads] = useState([]);
  const fileInputRef = useRef();

  // ✅ Fetch user's uploaded files (resumes + JDs)
  useEffect(() => {
    if (!user?._id) return;
    const safeUserId = user.id || user._id;
    fetch(`http://localhost:5000/api/resume?userId=${safeUserId}`)
      .then((res) => res.json())
      .then((data) => setUploads(data))
      .catch(console.error);
  }, [user]);

  // ✅ File selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // ✅ Drag & drop
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  // ✅ Upload logic
  const handleUpload = async () => {
    if (!file) return alert("Select a file first!");
    const safeUserId = user?.id || user?._id;
    if (!safeUserId) return alert("You must be logged in");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", safeUserId);
    formData.append("fileType", fileType);
      console.log("=== UPLOAD DEBUG ===");
  console.log("File:", file);
  console.log("UserId:", safeUserId);
  console.log("FileType:", fileType); 
  console.log("FormData entries:");
  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }
  console.log("==================");

    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Upload successful!");
        setUploads((prev) => [...prev, data.file]);
        setFile(null);
      } else {
        setMessage(data.message || "❌ Upload failed");
      }
    } catch (err) {
      console.error("Upload request error:", err);
      setMessage("❌ Upload failed");
    }
  };

  const Logout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <nav className="bg-blue-500 text-white p-4 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
      {/* App Title */}
      <div className="font-bold text-lg">AI Interview Prep App</div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
        {!user ? (
          <>
            <Link to="/">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <span>Welcome, {user.user?.name || user.name}</span>

            {/* File Type Selector 👇 */}
            <select
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              className="bg-white text-black px-2 py-1 rounded"
            >
              <option value="resume">Resume</option>
              <option value="jd">Job Description (JD)</option>
            </select>

            {/* Upload Box */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current.click()}
              className="border-2 border-dashed border-white p-2 text-black cursor-pointer hover:border-green-300 w-60 text-center bg-white text-sm"
            >
              {file ? file.name : "Drag & drop or click to upload"}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <button
              onClick={handleUpload}
              className="bg-green-500 px-2 py-1 rounded hover:bg-green-600"
            >
              Upload
            </button>

            <button
              onClick={Logout}
              className="bg-red-500 px-2 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}
      </div>

      {/* Status Message */}
      {message && <span className="mt-2 text-sm">{message}</span>}

      {/* Uploaded Files */}
      {user && uploads.length > 0 && (
        <div className="mt-4 w-full md:w-auto">
          <h2 className="font-bold text-white mb-2">Your Uploaded Files</h2>
          <ul className="space-y-1">
            {uploads.map((f) => (
              <li
                key={f._id}
                className="flex justify-between items-center bg-white text-black p-2 rounded"
              >
                <span>
                  {f.fileName}{" "}
                  <span className="text-gray-500 text-sm">({f.fileType})</span>
                </span>
                <button
                  onClick={() => window.open(f.fileUrl, "_blank")}
                  className="text-blue-500 hover:underline"
                >
                  View / Download
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
