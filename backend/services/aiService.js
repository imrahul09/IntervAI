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

export const generateInterviewQuestionsWithGemini = async ({
  resumeText,
  jobDescription,
}) => {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const prompt = `
You are an experienced technical interviewer and HR recruiter.

Generate personalized interview questions using the candidate's
resume and the provided job description.

CANDIDATE RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

INSTRUCTIONS:

1. Generate exactly 10 technical interview questions.
2. Generate exactly 8 HR interview questions.

TECHNICAL QUESTIONS:
- Focus on skills mentioned in the resume.
- Include questions about actual projects and experience.
- Cover technologies required by the job description.
- Include practical, conceptual and problem-solving questions.
- Assign difficulty: Easy, Medium or Hard.
- Include a topic and a short explanation of why the question is relevant.

HR QUESTIONS:
- Include introduction and career-related questions.
- Include teamwork, problem-solving and behavioral questions.
- Include questions related to the candidate's actual projects.
- Do not invent personal experiences or achievements.
- Include the category of each question.

IMPORTANT:
- Do not invent skills, technologies or project details.
- Questions should be relevant to the target job.
- Avoid repetitive and generic questions.
- Return valid structured JSON only.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: prompt,

    config: {
      responseMimeType: "application/json",

      responseSchema: {
        type: Type.OBJECT,

        properties: {
          technicalQuestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                topic: { type: Type.STRING },
                difficulty: { type: Type.STRING },
                relevance: { type: Type.STRING },
              },
              required: ["question", "topic", "difficulty", "relevance"],
            },
          },

          hrQuestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                category: { type: Type.STRING },
                relevance: { type: Type.STRING },
              },
              required: ["question", "category", "relevance"],
            },
          },
        },

        required: ["technicalQuestions", "hrQuestions"],
      },
    },
  });

  const questions = JSON.parse(response.text);

  return questions;
};
