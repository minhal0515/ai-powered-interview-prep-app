import express from "express";
import cors from "cors";
import { connectDB } from "./utils/connectDB.js";
import authRoutes from "./routes/auth.routes.js";
import { config } from "./config/env.js";
// @ts-ignore: no declaration file for upload.routes.js
import uploadRoutes from "./routes/upload.routes.js";
// @ts-ignore: no declaration file for resume.routes.js
import resumeRoutes from "./routes/resume.routes.js";
// @ts-ignore: no declaration file for pdfTest.routes.js
import pdfTestroutes from "./routes/pdfTest.routes.js";
// @ts-ignore: no declaration file for groqTest.routes.js
import groqTestroute from "./routes/groqTest.route.js";

const app = express();

app.use(cors({ 
  origin: "http://localhost:5173", 
  credentials: true 
}));
app.use(express.json());

app.get("/", (req, res) => res.send("API is running"));
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/test", pdfTestroutes);
app.use("/api/groq", groqTestroute);

connectDB();

app.listen(config.port, () => 
  console.log(`Server running on port ${config.port}`)
);