import express from "express";
import multer from "multer";
import cloudinary from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { File } from "../models/resume.model.js";
import streamifier from "streamifier";
import { PDFExtract } from "pdf.js-extract";
import mammoth from "mammoth";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const extractTextFromBuffer = async (buffer, fileName) => {
  try {
    const pdfExtract = new PDFExtract();
    const lower = fileName.toLowerCase();

    if (lower.endsWith(".pdf")) {
      const data = await pdfExtract.extractBuffer(buffer);
      const text = data.pages
        .map(p => p.content.map(c => c.str).join(" "))
        .join("\n");
      console.log("✅ PDF extracted text length:", text.length);
      return text;
    } else if (lower.endsWith(".docx")) {
      const data = await mammoth.extractRawText({ buffer });
      console.log("✅ DOCX extracted text length:", data.value.length);
      return data.value;
    } else if (lower.endsWith(".txt")) {
      const text = buffer.toString("utf-8");
      console.log("✅ TXT extracted text length:", text.length);
      return text;
    } else {
      console.warn("⚠️ Unsupported file type:", fileName);
      return "";
    }
  } catch (err) {
    console.error("❌ Extraction error for", fileName, err);
    return "";
  }
};

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { userId, fileType } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log(`📂 Uploading ${req.file.originalname} for user ${userId}`);

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto", folder: "uploads" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    console.log("✅ Uploaded to Cloudinary:", uploadResult.secure_url);

    const extractedText = await extractTextFromBuffer(req.file.buffer, req.file.originalname);

    const fileDoc = await File.create({
      userId,
      fileUrl: uploadResult.secure_url,
      fileName: req.file.originalname,
      fileType,
      text: extractedText,
    });

    console.log("✅ File saved to DB:", fileDoc._id);

    await User.findByIdAndUpdate(userId, { $push: { files: fileDoc._id } });

    res.status(200).json({
      message: "File uploaded and text extracted successfully",
      file: fileDoc,
    });
  } catch (err) {
    console.error("❌ Upload route error:", err);
    res.status(500).json({ error: "File upload failed" });
  }
});

export default router;
