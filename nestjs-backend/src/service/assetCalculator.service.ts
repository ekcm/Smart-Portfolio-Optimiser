import { Injectable } from "@nestjs/common";
import { Asset } from "src/model/asset.model";
import { AssetHolding } from "src/model/assetholding.model";
import { AssetPrice } from "src/model/assetprice.model";
import { CalculatorUtility } from "src/utilities/calculatorUtility";

@Injectable()
export class AssetCalculatorService {

    async calculateMarketValue(assetPrice: AssetPrice, assetHolding: AssetHolding): Promise<number> {
        return assetHolding.quantity * assetPrice.todayClose
    }

    async calculateTotalPL(assetPrice: AssetPrice, assetHolding: AssetHolding): Promise<number[]> {
        const totalPL = assetHolding.quantity * (assetPrice.todayClose - assetHolding.cost)
        const totalPLPercentage = CalculatorUtility.precisionRound((assetPrice.todayClose / assetHolding.cost - 1) * 100, 2)
        return [totalPL, totalPLPercentage]
    }

    async calculateDailyPL(assetPrice: AssetPrice, assetHolding: AssetHolding): Promise<number[]> {
        const dailyPL = assetHolding.quantity * (assetPrice.todayClose - assetPrice.yesterdayClose)
        const dailyPLPercentage = CalculatorUtility.precisionRound((assetPrice.todayClose / assetPrice.yesterdayClose - 1) * 100, 2)
        return [dailyPL, dailyPLPercentage]
    }

    async calculatePositionsRatio(assetHolding: AssetHolding, assetPrice: AssetPrice, totalValue: number): Promise<number> {
        const marketValue = await this.calculateMarketValue(assetPrice, assetHolding)
        return CalculatorUtility.precisionRound(marketValue / totalValue, 2)
    }

}