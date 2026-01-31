import "dotenv/config";
import { evaluateProposals } from "./index.js";

const proposals = [
  {
    id: "P1",
    title: "Smart Traffic Optimization",
    description: "AI traffic control using sensors and ML.",
    estimatedTimeMonths: 6,
    estimatedBudget: "low"
  },
  {
    id: "P2",
    title: "Community Solar Grid",
    description: "Local solar grids with shared battery storage.",
    estimatedBudget: "low",
    estimatedTimeMonths: 7,
  },
  {
    id: "P3",
    title: "Waste Sorting Automation",
    description: "Vision-based waste sorting for cities.",
    estimatedBudget: "high",
    estimatedTimeMonths: 4,
  }
];

(async () => {
  const result = await evaluateProposals(proposals);
  console.log("\n🏆 PROPOSAL AGENT OUTPUT:\n");
  console.dir(result, { depth: null });
})();
