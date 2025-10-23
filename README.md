AI Interview Prep
An intelligent interview preparation platform that generates personalized interview questions by analyzing your resume and job descriptions using AI.
✨ Features

📄 Smart File Upload - Upload resumes and job descriptions (PDF, DOCX, TXT)
🤖 AI-Powered Questions - Generate tailored interview questions using Groq's LLM
📊 Text Extraction - Automatically extract and parse content from uploaded documents
☁️ Cloud Storage - Secure file storage using Cloudinary
🎨 Modern UI - Clean, responsive interface built with React and Tailwind CSS
🔐 User Authentication - Secure user accounts and file management

🚀 Tech Stack
Frontend

React - UI framework
Tailwind CSS - Styling
Axios - HTTP client
React Context - State management

Backend

Node.js - Runtime environment
Express - Web framework
MongoDB - Database
Mongoose - ODM

AI & Services

Groq API - LLM for question generation
Cloudinary - File storage
pdf.js-extract - PDF text extraction
Mammoth - DOCX text extraction

📋 Prerequisites
Before you begin, ensure you have:

Node.js (v16 or higher)
MongoDB (local or Atlas)
Groq API Key (Get one here)
Cloudinary Account (Sign up here)

🛠️ Installation
1. Clone the Repository
bashgit clone https://github.com/yourusername/ai-interview-prep.git
cd ai-interview-prep
2. Install Backend Dependencies
bashcd backend
npm install
3. Install Frontend Dependencies
bashcd ../frontend
npm install
4. Environment Variables
Create a .env file in the backend directory:
env# MongoDB
MONGO_URI=mongodb://localhost:27017/ai-interview-prep
# or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ai-interview-prep

# Groq API
GROQ_API_KEY=your_groq_api_key_here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server
PORT=5000
NODE_ENV=development

# JWT (if using authentication)
JWT_SECRET=your_jwt_secret_here
5. Create Required Directories
bash# In backend directory
mkdir uploads temp
🎯 Usage
Development Mode
Terminal 1 - Backend:
bashcd backend
npm run dev
Terminal 2 - Frontend:
bashcd frontend
npm start
The app will be available at:

Frontend: http://localhost:3000
Backend: http://localhost:5000

Production Build
Backend:
bashcd backend
npm start
Frontend:
bashcd frontend
npm run build
npm install -g serve
serve -s build
📖 How It Works

Upload Documents

User uploads their resume (PDF/DOCX/TXT)
User uploads target job description
Text is extracted and stored in MongoDB


AI Processing

Resume and JD texts are sent to Groq's LLM
AI analyzes both documents for relevance
Generates 5-10 tailored interview questions


Display Results

Questions are formatted and displayed
Users can copy, save, or export questions
