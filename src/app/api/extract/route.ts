import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    // Use correct model name - gemini-2.5-flash doesn't exist yet
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"  // Correct model name
    });

    const prompt = `
      You are an OCR assistant.
      Extract all numbers from the image row by row.
      For each row, return JSON with keys: "numbers", "count", "sum".
      Also add a "grand_total".
      IMPORTANT: Return ONLY valid JSON, no additional text or code blocks.

      Example format:
      {
        "rows": [
          {"numbers": [1, 2, 3], "count": 3, "sum": 6},
          {"numbers": [4, 5], "count": 2, "sum": 9}
        ],
        "grand_total": 15
      }
    `;

    const result = await model.generateContent([
      {
        inlineData: {
          data: buffer.toString("base64"),
          mimeType: file.type
        }
      },
      { text: prompt }
    ]);

    // Safe parsing with better error handling
    const responseText = result.response.text();

    // Clean the response (remove markdown code blocks)
    const cleanText = responseText.replace(/```json|```/g, '').trim();

    let json;
    try {
      json = JSON.parse(cleanText);
    } catch (e) {
      console.error("JSON Parse Error:", cleanText);
      return NextResponse.json({
        error: "Failed to parse AI response as JSON",
        rawResponse: cleanText
      }, { status: 500 });
    }

    return NextResponse.json(json);

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}