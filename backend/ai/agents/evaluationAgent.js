export function evaluationAgent(amount, analysis, lowestAmount) {
  const priceScore = lowestAmount / amount;

  return (
    priceScore * 0.4 +
    analysis.quality * 0.25 +
    analysis.experience * 0.2 +
    analysis.speed * 0.1 -
    analysis.risk * 0.05
  );
}
