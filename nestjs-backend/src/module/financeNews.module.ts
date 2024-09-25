import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FinanceNewsController } from '../controller/financeNews.controller';
import { FinanceNewsService } from '../service/financeNews.service';
import { FinanceNews, FinanceNewsSchema } from '../model/financeNews.model';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: FinanceNews.name, schema: FinanceNewsSchema }])
    ],
    controllers: [FinanceNewsController],
    providers: [FinanceNewsService],
    exports: [FinanceNewsService]
})
export class FinanceNewsModule { }