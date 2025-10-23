import express from "express";
import { File } from "../models/resume.model.js";
import { User } from "../models/user.model.js";

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const { userId, fileType } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const query = { userId };

    if (fileType && ["resume", "jd"].includes(fileType)) {
      query.fileType = fileType;
    }

    console.log("Fetching files with query:", query);
    const files = await File.find(query).sort({ uploadedAt: -1 });

    res.json(files);
  } catch (err) {
    console.error("Error fetching files:", err);
    res.status(500).json({ message: "Error fetching files" });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const file = await File.findByIdAndDelete(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    res.json({ message: `${file.fileType} deleted successfully` });
  } catch (err) {
    console.error("Error deleting file:", err);
    res.status(500).json({ message: "Error deleting file" });
  }
});

export default router;
