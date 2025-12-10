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
  
  // Explicitly check for undefined or string "undefined" which can happen in build processes
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
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

  try {
    const base64Data = await processFile(file);

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
        // Robust cleaning: remove markdown code blocks if the model adds them
        const cleanText = response.text.replace(/```json|```/g, '').trim();
        return JSON.parse(cleanText) as AIAnalysisResult;
    }
    throw new Error("No response text from AI");

  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    
    let errorMessage = "Couldn't quite identify this. Try another angle?";
    
    // Surface specific API errors to the user UI for debugging
    if (error.message) {
        if (error.message.includes('403')) errorMessage = "API Key invalid or restricted (403). Check Vercel Env Vars.";
        else if (error.message.includes('429')) errorMessage = "Quota exceeded (429). You are snapping too fast!";
        else if (error.message.includes('500')) errorMessage = "Google AI service error (500). Try again.";
        else if (error.message.includes('JSON')) errorMessage = "AI response format error. Please retry.";
    }

    // Fallback for demo stability
    return {
      foodName: "Unknown Dish",
      tags: ["Food"],
      insight: errorMessage,
      healthyScore: 5,
      isFried: false,
      isSweet: false,
      isVeg: false
    };
  }
};