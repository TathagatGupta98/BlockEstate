import { GoogleGenerativeAI } from "@google/generative-ai";
import { extractJsonObject } from "../utils/json.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function proposalUnderstandingAgent(description) {
  const prompt = `
Return ONLY valid JSON. No markdown. No backticks.

Schema:
{
  "relevance": number (0-1),
  "feasibility": number (0-1),
  "impact": number (0-1),
  "clarity": number (0-1),
  "risk": number (0-1),
  "approxTimeMonths": number,
  "approxBudgetLevel": "low" | "medium" | "high",
  "keyRisks": string[],
  "requirements": string[],
  "suggestedChanges": string[]
}

Proposal:
"${description}"
`;

  const result = await model.generateContent(prompt);
  const raw = result.response.text();

  const jsonStr = extractJsonObject(raw);
  if (!jsonStr) {
    throw new Error("Gemini returned invalid JSON.");
  }

  return JSON.parse(jsonStr);
}
