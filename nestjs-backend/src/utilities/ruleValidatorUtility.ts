export class RuleValidatorUtility {

    public static checkMinCash(percentage: number, total: number, cash: number) : boolean {
        return cash >= (total * (percentage / 100))
    }

    public static checkMaxCash(percentage: number, total: number, cash: number) : boolean {
        return cash <= (total * (percentage / 100))
    }

    public static checkRiskComposition(percentage: number, stocks: number) : boolean {
        return stocks <= percentage + 5 //including leeway of 5%
    }
    
}