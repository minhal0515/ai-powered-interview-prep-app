import express from "express";
import { extractTextFromLocalPDF } from "../utils/pdfParser.js";
const router = express.Router();

router.post("/pdf/parse", async (req, res) => {
  try {
    const { pdfUrl } = req.body;
    if (!pdfUrl) return res.status(400).json({ error: "PDF URL required" });
    const text = await extractTextFromLocalPDF("sample_resume.pdf");
    const text2 = await extractTextFromLocalPDF("sample_jd.pdf");
    res.json({
      success: true,
      length: text.length, text2Length: text2.length,
      preview: text.substring(0, 300) + "...", preview2: text2.substring(0, 300) + "..."
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
