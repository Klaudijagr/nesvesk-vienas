import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateEventDescription = async (
  title: string,
  location: string,
  mood: string
): Promise<string> => {
  if (!title) {
    throw new Error("Event title is required for generation.");
  }

  try {
    const prompt = `
      Write a compelling, short event description (max 150 words) for an event.
      Event Title: ${title}
      Location: ${location || "TBD"}
      Vibe/Mood: ${mood}
      
      Format with a catchy opening hook. Use markdown for bolding key parts.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "Could not generate description.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate description. Please try again.";
  }
};
