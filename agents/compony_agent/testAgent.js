import { evaluateBids } from "./index.js";

const bids = [
  {
    contractor: "Alpha Builders",
    amount: 95000,
    description: "High quality materials, 5 month timeline, 10 years experience"
  },
  {
    contractor: "Beta Constructions",
    amount: 88000,
    description: "Moderate quality, 7 month timeline, 4 years experience"
  },
  {
    contractor: "Gamma Infra",
    amount: 102000,
    description: "Premium materials, fast 4 month delivery, 12 years experience"
  }
];

(async () => {
  const result = await evaluateBids(bids);
  console.log("\n🏆 AGENT OUTPUT:\n");
  console.dir(result, { depth: null });
})();
