import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult } from "../types";

const processFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the "data:*/*;base64," prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

export const analyzeFoodImage = async (file: File): Promise<AIAnalysisResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    // Return mock data if no key for demo purposes to prevent app crash
    console.warn("No API Key found, returning mock data");
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      foodName: "Mock Meal",
      tags: ["Demo", "Test"],
      insight: "This looks like a delicious demo meal! (Add API Key to settings)",
      healthyScore: 8,
      isFried: false,
      isSweet: false,
      isVeg: true
    };
  }

  const ai = new GoogleGenAI({ apiKey });
  const base64Data = await processFile(file);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: file.type,
              data: base64Data
            }
          },
          {
            text: `Analyze this food image for a student eating habit tracker.
            Identify the food name, assign relevant tags (e.g., Noodles, Rice, Fried, Sweet, Veggie, Spicy, Healthy, Snack, Late-night),
            determine boolean flags for Fried, Sweet, and Veggie,
            and provide a short, friendly, non-judgmental 1-sentence insight about the meal pattern.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            foodName: { type: Type.STRING },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            insight: { type: Type.STRING },
            healthyScore: { type: Type.NUMBER, description: "1 to 10" },
            isFried: { type: Type.BOOLEAN },
            isSweet: { type: Type.BOOLEAN },
            isVeg: { type: Type.BOOLEAN }
          },
          required: ["foodName", "tags", "insight", "healthyScore", "isFried", "isSweet", "isVeg"]
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text) as AIAnalysisResult;
    }
    throw new Error("No response text");

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback for demo stability
    return {
      foodName: "Unknown Dish",
      tags: ["Food"],
      insight: "Couldn't quite identify this, but hope it tastes good!",
      healthyScore: 5,
      isFried: false,
      isSweet: false,
      isVeg: false
    };
  }
};