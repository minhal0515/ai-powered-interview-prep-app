  import { PDFExtract } from "pdf.js-extract";
import fs from "fs/promises";

const pdfExtract = new PDFExtract();

export const extractTextFromLocalPDF = async (filePath) => {
  try {
    const data = await pdfExtract.extract(filePath);
    const text = data.pages
      .map((p) => p.content.map((c) => c.str).join(" "))
      .join("\n");
    console.log("Extracted text length:", text.length);
    return text;
  } catch (err) {
    console.error("PDF parse error:", err);
    throw new Error("Failed to extract text");
  }
};
