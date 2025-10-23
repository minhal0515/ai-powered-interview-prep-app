import express from 'express';
import { getInterviewQuestions } from '../utils/groqClient.js';
import { File } from '../models/resume.model.js';

const router = express.Router();

router.post('/test-groq', async (req, res) => {
    try{
        const { resumeId, jdId, resumeTextManual, jdTextManual } = req.body;
        let resumeText = resumeTextManual || '';
        let jdText = jdTextManual || '';
        
        if(!resumeText || !jdText){
            if(!resumeId || !jdId){
                return res.status(400).json({ message: "Either provide manual texts or valid resumeId and jdId" });
            }
            
            const resumeFile = await File.findById(resumeId);
            const jdFile = await File.findById(jdId);
            
            if(!resumeFile || !jdFile){
                return res.status(404).json({ message: "Resume or Job Description file not found" });
            }
            
            resumeText = resumeFile.text || '';
            jdText = jdFile.text || '';
        }

        console.log('📄 Resume Text Length:', resumeText.length);
        console.log('📄 JD Text Length:', jdText.length);
        console.log('📄 Resume Preview:', resumeText.substring(0, 200));
        console.log('📄 JD Preview:', jdText.substring(0, 200));

        if (!resumeText || !jdText || resumeText.length < 50 || jdText.length < 5) {
            return res.status(400).json({ 
                message: "Resume or JD text is missing or too short",
                debug: {
                    resumeLength: resumeText.length,
                    jdLength: jdText.length
                }
            });
        }

        const questions = await getInterviewQuestions(resumeText, jdText);
        res.status(200).json({ questions });
        
    } catch (error) {
        console.error("Error in /test-groq:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

export default router;