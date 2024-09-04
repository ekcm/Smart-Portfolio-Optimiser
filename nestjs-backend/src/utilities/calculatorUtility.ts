export abstract class CalculatorUtility {

    public static precisionRound(number, precision) {
        if (precision < 0) {
            var factor = Math.pow(10, precision);
            return Math.round(number * factor) / factor;
        } else {
            return + (Math.round(Number(number + "e+" + precision)) + "e-" + precision)
        }
    }

    public static calculateMarketValue(todayClose: number, quantity: number): number {
        return quantity * todayClose
    }

    public static totalPL(quantity: number, cost: number, todayClose: number): number{
        return quantity * (todayClose - cost)
    }

    public static totalPLPercentage(cost: number, todayClose: number): number {
        return this.precisionRound((todayClose / cost - 1) * 100, 2) 
    }

    public static dailyPL(quantity: number, todayClose: number, yesterdayClose: number): number {
        return quantity * (todayClose - yesterdayClose)
    }

    public static dailyPLPercentage(todayClose: number, yesterdayClose: number): number {
        return this.precisionRound((todayClose / yesterdayClose - 1) * 100, 2)
    }

    public static calculatePositionsRatio(todayClose: number, quantity: number, totalValue: number): number {
        const marketValue = this.calculateMarketValue(todayClose, quantity)
        return this.precisionRound(marketValue / totalValue, 2)
    }
}