import { min } from "class-validator"

export class RuleValidatorUtility {

    public static checkMinCash(percentage: number, total: number, cash: number) : boolean {
        return cash >= (total * (percentage / 100))
    }

    public static checkMaxCash(percentage: number, total: number, cash: number) : boolean {
        return cash <= (total * (percentage / 100))
    }


    public static checkRiskComposition(stockComposition: number, stocks: number, minCash: number, maxCash: number) : boolean {
        const averageCash : number = (Number(minCash) + Number(maxCash)) / 2
        const threshold = ((100 - averageCash)/100) * stockComposition

        return stocks <= threshold + 5 //including leeway of 5%
    }
    
}