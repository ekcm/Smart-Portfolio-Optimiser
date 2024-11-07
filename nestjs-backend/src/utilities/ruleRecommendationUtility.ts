export class RuleRecommendationUtility {

    public static recommendMinCash(percentage: number, total: number, cash: number): string {
        return `You are currently lacking $${(total * (percentage / 100) - cash).toFixed(2)} to meet the minimum cash requirement of ${percentage}%. Please deposit or liquidate assets to meet the requirement.`
    }

    public static recommendMaxCash(percentage: number, total: number, cash: number): string {
        return `You have exceeded the maximum cash requirement of ${percentage}% by $${(cash - total * (percentage / 100)).toFixed(2)}. Please invest the excess cash to meet the requirement.`
    }
}