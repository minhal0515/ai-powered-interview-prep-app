import Groq from "groq-sdk";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is not defined in environment variables");
}

const groq = new Groq({ apiKey: GROQ_API_KEY });

export const getInterviewQuestions = async (resumeText, jdText) => {
  try {
    const prompt = `Generate a list of interview questions based on the following resume and job description.

Resume:
${resumeText}

Job Description:
${jdText}

Please provide 5-10 relevant interview questions that test the candidate's fit for this role.`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const generatedText = response.choices[0]?.message?.content || "";
    
    const questions = generatedText
      .split("\n")
      .filter(q => q.trim() !== "" && q.trim().length > 10)
      .map(q => q.trim());

    return questions;

  } catch (error) {
    console.error("Error generating interview questions:", error);
    throw new Error("Failed to generate interview questions");
  }
};