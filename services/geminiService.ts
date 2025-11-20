import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';

let ai: GoogleGenAI | null = null;
try {
    if (apiKey) {
        ai = new GoogleGenAI({ apiKey });
    }
} catch (e) {
    console.error("Failed to initialize Gemini API", e);
}

export const enhanceTaskDescription = async (title: string, currentDescription: string): Promise<string> => {
  if (!ai) return "API Key missing. Please configure process.env.API_KEY.";

  try {
    const model = ai.models;
    const prompt = `
      You are a helpful project manager assistant. 
      The user has a task titled "${title}".
      Current description: "${currentDescription}".
      
      Please rewrite the description to be more professional, clear, and actionable. 
      Include a short bulleted list of potential acceptance criteria.
      Keep it under 150 words.
    `;

    const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || currentDescription;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating suggestion. Please try again.";
  }
};

export const generateSubtasks = async (title: string): Promise<{ title: string }[]> => {
    if (!ai) return [];

    try {
        const model = ai.models;
        const prompt = `
            Generate a list of 3-5 concrete subtasks for a project task titled: "${title}".
            Return JSON only.
        `;

        const response = await model.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING }
                        }
                    }
                }
            }
        });

        const text = response.text;
        if (!text) return [];
        return JSON.parse(text);
    } catch (error) {
        console.error("Gemini API Error:", error);
        return [];
    }
}
