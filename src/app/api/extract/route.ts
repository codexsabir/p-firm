import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    You are an OCR assistant.
    Extract all numbers from the image row by row.
    For each row, return JSON with keys: "numbers", "count", "sum".
    Also add a "grand_total".
    JSON only, no text.
  `;

  const result = await model.generateContent([
    { inlineData: { data: buffer.toString("base64"), mimeType: file.type } },
    { text: prompt }
  ]);

  // Parse Gemini JSON output safely
  let json: any;
  try {
    json = JSON.parse(result.response.candidates[0].content[0].text);
  } catch (e) {
    return NextResponse.json({ error: "Failed to parse response" }, { status: 500 });
  }

  return NextResponse.json(json);
}
