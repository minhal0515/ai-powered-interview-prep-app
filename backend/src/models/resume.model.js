import mongoose from 'mongoose';
const resumeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fileUrl: { type: String, required: true },
  fileName: { type: String, required: true },
  fileType: {type: String, required: true},
  text: {type: String, required: true},
  uploadedAt: { type: Date, default: Date.now },
});

export const File = mongoose.model("File", resumeSchema);