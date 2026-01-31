import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

export async function understandingAgent(description) {
  const prompt = `
Return ONLY valid JSON.
Do NOT use markdown.
Do NOT wrap in backticks.

Schema:
{
  "quality": number (0-1),
  "speed": number (0-1),
  "experience": number (0-1),
  "risk": number (0-1)
}

Bid description:
"${description}"
`;

  const result = await model.generateContent(prompt);
  let text = result.response.text();

  // 🔒 SAFETY: remove markdown if model ignores instructions
  text = text.replace(/```json|```/g, "").trim();

  return JSON.parse(text);
}
