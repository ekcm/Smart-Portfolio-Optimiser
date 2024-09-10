import { Injectable } from '@nestjs/common';
import { AssetService } from './asset.service';
import { AssetPriceService } from './assetprice.service';
import { OrderDto } from 'src/dto/order.dto';
import { OrderType } from 'src/model/order.model';

@Injectable()
export class PortfolioCreationService{

    private CASH_PERCENTAGE = 0.1

    constructor(private assetService: AssetService, private assetPriceService: AssetPriceService) {}
    
    async generateOrders(cash: number, riskAppetite: string, exclusions: string[], portfolioId: string): Promise<OrderDto[]> {
        const assets = await this.assetService.getAllExcept(exclusions);
        const tickers = assets.map(asset => asset.ticker);
        const weights = {'AAPL': 1}
        var proposedOrders: OrderDto[] = []
        for (let ticker in weights) {
            const assetPrice = await this.assetPriceService.getByTickerLatest(ticker);
            proposedOrders.push({
                orderType: OrderType.BUY,
                orderDate: new Date(),
                assetName: ticker,
                quantity: (cash * (1 - this.CASH_PERCENTAGE) * weights[ticker]) / assetPrice.todayClose,
                price: assetPrice.todayClose,
                portfolioId: portfolioId
            })
        }

        return proposedOrders
    }
}

