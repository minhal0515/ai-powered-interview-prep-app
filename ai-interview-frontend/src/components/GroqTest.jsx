import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.jsx";

export default function GroqTest() {
  const { user } = useContext(AuthContext);
  const [uploads, setUploads] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUploads = async () => {
      if (!user?._id && !user?.id) return;
      const safeUserId = user.id || user._id;

      try {
        const res = await axios.get(
          `http://localhost:5000/api/resume?userId=${safeUserId}`
        );
        setUploads(res.data);
      } catch (err) {
        console.error("Failed to fetch uploads:", err);
        setError("Failed to load your files");
      }
    };

    fetchUploads();
  }, [user]);

  const handleGenerateQuestions = async () => {
    setError("");
    
    if (!uploads || uploads.length === 0) {
      setError("No uploaded files found. Please upload a resume and JD first.");
      return;
    }

    const latestResume = uploads
      .filter(f => f.fileType === "resume")
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))[0];

    const latestJD = uploads
      .filter(f => f.fileType === "jd")
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))[0];

    if (!latestResume || !latestJD) {
      setError("Please upload both a resume and a JD.");
      return;
    }

    setLoading(true);
    setQuestions([]);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/groq/test-groq",
        {
          resumeId: latestResume._id,
          jdId: latestJD._id,
        }
      );
      
      if (res.data.questions && res.data.questions.length > 0) {
        setQuestions(res.data.questions);
      } else {
        setError("No questions were generated. Please try again.");
      }
    } catch (err) {
      console.error("Failed to generate questions:", err);
      setError(err.response?.data?.message || "Failed to generate questions");
    } finally {
      setLoading(false);
    }
  };

  // Filter out generic/placeholder text from questions
  const filteredQuestions = questions.filter(q => {
    const lower = q.toLowerCase();
    return !lower.includes("once you provide") && 
           !lower.includes("please provide") &&
           !lower.includes("hypothetical") &&
           q.length > 20;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            AI Interview Question Generator
          </h1>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <button
            onClick={handleGenerateQuestions}
            disabled={loading}
            className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating...
              </span>
            ) : (
              "✨ Generate Questions"
            )}
          </button>

          {uploads.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-700 mb-1">
                <span className="font-semibold">📄 Resume:</span>{" "}
                {uploads.find(f => f.fileType === "resume")?.fileName || "Not uploaded"}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">📋 Job Description:</span>{" "}
                {uploads.find(f => f.fileType === "jd")?.fileName || "Not uploaded"}
              </p>
            </div>
          )}

          {filteredQuestions.length > 0 && (
            <div className="mt-8 max-w-4xl">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                Generated Questions
              </h2>
              <div className="space-y-4">
                {filteredQuestions.map((q, i) => {
                  const cleanQuestion = q
                    .replace(/^[\*\-\•]\s*/, '')
                    .replace(/^Q?\d+[\.\)]\s*/, '')
                    .replace(/^\d+[\.\)]\s*/, '')
                    .trim();

                  return (
                    <div 
                      key={i} 
                      className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-r-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        
                        <p className="text-gray-800 leading-relaxed break-words flex-1">
                          {cleanQuestion}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!loading && questions.length === 0 && !error && (
            <div className="mt-8 text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg">No questions generated yet</p>
              <p className="text-sm mt-2">Upload your resume and JD, then click "Generate Questions"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}