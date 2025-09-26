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

    // CORRECT MODEL NAME - gemini-2.5-flash doesn't exist yet
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"  // ✅ Correct model name
    });

    const prompt = `
      You are an OCR assistant analyzing a calculator page or number table.

      Extract all numbers from the image row by row.

      For each row, return JSON with these keys:
      - "numbers": array of numbers found in the row
      - "count": how many numbers in this row
      - "sum": total sum of numbers in this row
      - "average": average of numbers in this row (sum/count)

      Also include these overall calculations:
      - "grand_total": sum of all numbers across all rows
      - "total_count": total count of all numbers across all rows (sum of all row counts)
      - "overall_average": average of all numbers (grand_total / total_count)

      IMPORTANT: Return ONLY valid JSON, no additional text or code blocks.

      Example format:
      {
        "rows": [
          {"numbers": [1, 2, 3], "count": 3, "sum": 6, "average": 2},
          {"numbers": [4, 5, 6], "count": 3, "sum": 15, "average": 5}
        ],
        "grand_total": 21,
        "total_count": 6,
        "overall_average": 3.5
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