import { min } from "class-validator"

export class RuleValidatorUtility {

    public static checkMinCash(percentage: number, total: number, cash: number) : boolean {
        return cash >= (total * (percentage / 100))
    }

    public static checkMaxCash(percentage: number, total: number, cash: number) : boolean {
        return cash <= (total * (percentage / 100))
    }


    public static checkRiskComposition(percentage: number, stocks: number, minCash: number, maxCash: number) : boolean {
        const threshold = ((100 - (minCash + maxCash)/2)/100) * percentage
        return stocks <= threshold + 5 //including leeway of 5%
    }
    
}