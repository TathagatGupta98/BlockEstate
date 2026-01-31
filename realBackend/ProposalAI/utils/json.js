export function extractJsonObject(text) {
  if (!text || typeof text !== "string") return null;

  // strip markdown fences
  let cleaned = text.replace(/```json|```/g, "").trim();

  // find first {...}
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) return null;

  const jsonStr = cleaned.slice(start, end + 1);
  return jsonStr;
}
