import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PortfolioRuleController } from '../controller/portfolioRule.controller';
import { PortfolioRuleService } from '../service/portfolioRule.service';
import { PortfolioRule, PortfolioRuleSchema } from '../model/portfolioRule.model';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: PortfolioRule.name, schema: PortfolioRuleSchema }])
    ],
    controllers: [PortfolioRuleController],
    providers: [PortfolioRuleService],
    exports: [PortfolioRuleService]
})
export class PortfolioRuleModule {}