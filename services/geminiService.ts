
import { GoogleGenAI, Type } from "@google/genai";
import { SpriteConfig } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeStaffPhoto = async (base64Image: string): Promise<SpriteConfig> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: "Analyze this person and return a JSON object representing them as a retro 8-bit character. Choose colors from this set: Black, Blue, Red, Magenta, Green, Cyan, Yellow, White, BrightRed, BrightGreen, BrightYellow, BrightWhite. Map their features to these fields: hairColor, skinColor, shirtColor, pantsColor, accessory (glasses, santa-hat, reindeer-ears, or none), name, role, beard (none, stubble, red), and hairType (normal, thinning, curly, long). Be precise about hair color (blonde, red, black, etc) and physical details."
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          hairColor: { type: Type.STRING },
          skinColor: { type: Type.STRING },
          shirtColor: { type: Type.STRING },
          pantsColor: { type: Type.STRING },
          accessory: { type: Type.STRING },
          name: { type: Type.STRING },
          role: { type: Type.STRING },
          beard: { type: Type.STRING },
          hairType: { type: Type.STRING }
        },
        required: ["hairColor", "skinColor", "shirtColor", "pantsColor", "name", "role", "beard", "hairType"]
      }
    }
  });

  return JSON.parse(response.text) as SpriteConfig;
};

export const generateXmasGreeting = async (staffNames: string[]): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Write a fun, short retro-gaming Christmas greeting for the agency 'Eixos Creativa'. Start with 'BONES FESTES' and mention the staff members: ${staffNames.join(', ')}. Use 8-bit terminology like 'LEVEL 2025 UNLOCKED' or 'BONUS STAGE'. Maximum 15 words. Language: Spanish/Catalan hybrid.`,
  });
  return response.text;
};
