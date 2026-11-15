import { GoogleGenAI, Type } from "@google/genai";

export const analyzeResumeWithGemini = async ({
  resumeText,
  jobDescription,
}) => {
  // create Gemini client using our secret API key
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const prompt = `You are an expert technical recruiter and resume analyst. 
                Analyze the candidate's resume against the job Description 
                RESUME:${resumeText}  JOB DESCRIPTION: ${jobDescription}
                Evaluate  only the evidance provided. Do not invent skills or experience . 
                Give a realistic match score from 0 to 100`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          matchScore: { type: "NUMBER" },
          matchedSkills: { type: "ARRAY", items: { type: "STRING" } },
          missingSkills: { type: "ARRAY", items: { type: "STRING" } },
          strengths: { type: "ARRAY", items: { type: "STRING" } },
          weakness: { type: "ARRAY", items: { type: "STRING" } },
          suggestions: { type: "ARRAY", items: { type: "STRING" } },
        },
      },
      required: [
        "matchScore",
        "matchedSkills",
        "missingSkills",
        "strenghts",
        "weakness",
        "suggestions",
      ],
    },
  });

  // convert Geminis json text into a javascript object
  const analysis = JSON.parse(response.text);
  return analysis;
};
