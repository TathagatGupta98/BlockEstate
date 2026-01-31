import { GoogleGenerativeAI } from "@google/generative-ai";

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
  "approxBudgetLevel": "low" | "medium" | "high"
}

Proposal:
"${description}"
`;

  const result = await model.generateContent(prompt);
  let text = result.response.text();

  // safety strip if model ignores instructions
  text = text.replace(/```json|```/g, "").trim();

  return JSON.parse(text);
}
