import { Module } from "@nestjs/common";

import { AssetCalculatorService } from "src/service/assetCalculator.service";

@Module({
    providers: [AssetCalculatorService],
    exports: [AssetCalculatorService],
})

export class AssetCalculatorModule { }   