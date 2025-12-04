"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import sharp from "sharp";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function analyzeFoodImage(formData: FormData) {
  const file = formData.get("image") as File;

  if (!file) {
    return { error: "No image file provided." };
  }

  try {
    // 1. Image ko buffer me convert karo
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. AVIF/HEIC ko JPEG me convert karo
    let processedBuffer: Buffer;
    let mimeType = "image/jpeg";

    try {
      processedBuffer = await sharp(buffer)
        .jpeg({ quality: 85 })
        .toBuffer();
    } catch (sharpError) {
      console.error("Image conversion failed:", sharpError);
      return { error: "Failed to process image. Please try a different photo." };
    }

    // 3. Base64 encode
    const base64Image = processedBuffer.toString("base64");

    // 4. Model initialize
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.4,
        topP: 0.95,
        topK: 40,
      }
    });

    // 5. ULTRA STRICT PROMPT
    const prompt = `
You are a nutrition analysis AI. Analyze this food image and return ONLY a JSON object with no additional text, explanations, or markdown formatting.

STRICT RULES:
- Return ONLY the JSON object
- NO markdown code blocks
- NO explanations before or after JSON
- NO text like "Here is the analysis"
- Start directly with {
- End directly with }

JSON STRUCTURE (copy exactly):
{
  "foods": [
    {
      "name": "food item name",
      "portion_size": "estimated portion",
      "calories": 0,
      "protein": 0,
      "carbs": 0,
      "fats": 0,
      "confidence": "High"
    }
  ],
  "total_calories": 0,
  "total_protein": 0,
  "total_carbs": 0,
  "total_fats": 0,
  "meal_type": "lunch",
  "health_tip": "brief tip"
}

If you cannot identify food, return:
{
  "foods": [{"name": "Unknown food", "portion_size": "N/A", "calories": 0, "protein": 0, "carbs": 0, "fats": 0, "confidence": "Low"}],
  "total_calories": 0,
  "total_protein": 0,
  "total_carbs": 0,
  "total_fats": 0,
  "meal_type": "snack",
  "health_tip": "Please upload a clearer image"
}
`;

    // 6. AI call
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: mimeType,
        },
      },
    ]);

    const response = await result.response;
    let text = response.text();

    console.log("Raw AI Response:", text);

    // 7. AGGRESSIVE JSON CLEANING - FIXED REGEX
    text = text.replace(/```json/gi, "");
    text = text.replace(/```/gi, "");
    text = text.replace(/^\s*JSON STRUCTURE[\s\S]*/i, "");
    text = text.replace(/[\r\n]+/g, " ");
    
    // Remove any text before first {
    const firstBrace = text.indexOf("{");
    if (firstBrace > 0) {
      text = text.substring(firstBrace);
    }
    
    // Remove any text after last }
    const lastBrace = text.lastIndexOf("}");
    if (lastBrace !== -1) {
      text = text.substring(0, lastBrace + 1);
    }
    
    text = text.trim();

    console.log("Cleaned JSON:", text);

    // 8. SAFE JSON PARSE
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Failed text:", text);
      return { 
        error: "AI returned invalid format. Try uploading a clearer food image.",
        debug: text.substring(0, 200)
      };
    }

    // 9. VALIDATE required fields
    if (!data.foods || !Array.isArray(data.foods) || data.foods.length === 0) {
      return {
        error: "Could not detect any food in the image. Please try again with a clearer photo.",
      };
    }

    // 10. Add defaults for missing fields
    data.foods = data.foods.map((food: any) => ({
      name: food.name || "Unknown food",
      portion_size: food.portion_size || "N/A",
      calories: parseInt(food.calories) || 0,
      protein: parseInt(food.protein) || 0,
      carbs: parseInt(food.carbs) || 0,
      fats: parseInt(food.fats) || 0,
      confidence: food.confidence || "Low"
    }));

    data.total_calories = parseInt(data.total_calories) || 0;
    data.total_protein = parseInt(data.total_protein) || 0;
    data.total_carbs = parseInt(data.total_carbs) || 0;
    data.total_fats = parseInt(data.total_fats) || 0;
    data.meal_type = data.meal_type || "meal";
    data.health_tip = data.health_tip || "Enjoy your meal!";

    return { success: true, data };

  } catch (error: any) {
    console.error("Fatal Error:", error);
    return { 
      error: "Something went wrong. Please try again.",
      details: error.message 
    };
  }
}
