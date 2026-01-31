import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function proposalDecisionAgent(rankedProposals) {
  const prompt = `
Explain in plain English why the top proposal ranked highest.

Ranked proposals:
${JSON.stringify(rankedProposals, null, 2)}
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
