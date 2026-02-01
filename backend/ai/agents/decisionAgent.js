import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

export async function decisionAgent(rankedBids) {
  const prompt = `
Explain in plain English why the top-ranked contractor was selected.

Ranked bids:
${JSON.stringify(rankedBids, null, 2)}
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
