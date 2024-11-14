export class RuleValidatorUtility {

    public static checkMinCash(percentage: number, total: number, cash: number) : boolean {
        return cash >= (total * (percentage / 100))
    }

    public static checkMaxCash(percentage: number, total: number, cash: number) : boolean {
        return cash <= (total * (percentage / 100))
    }

    public static checkRiskComposition(percentage: number, total: number, stocks: number) : boolean {
        return stocks <= (total * (percentage + 5 / 100)) //including leeway of 5%
    }
    
}