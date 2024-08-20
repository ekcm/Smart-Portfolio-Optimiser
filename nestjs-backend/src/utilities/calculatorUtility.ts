export abstract class CalculatorUtility {

    public static precisionRound(number, precision) {
        if (precision < 0) {
            var factor = Math.pow(10, precision);
            return Math.round(number * factor) / factor;
        } else {
            return + (Math.round(Number(number + "e+" + precision)) + "e-" + precision)
        }
    }
}