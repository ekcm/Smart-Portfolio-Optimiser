import { Injectable } from "@nestjs/common";

@Injectable()
export class RuleValidatorService {

    async checkPortfolio(body: any): Promise<any> {
        return { status: "Portfolio rules checked" };
    }

    async checkAddStock(body: any): Promise<any> {
        return { status: "Add stock rules checked" };
    }

    async checkOptimisePortfolio(body: any): Promise<any> {
        return { status: "Optimisation rules checked" };
    }

    async checkStockUpdate(body: any): Promise<any> {
        return { status: "Stock update rules checked" };
    }

    async checkHomeDashboard(body: any): Promise<any> {
        return { status: "Home dashboard rules checked" };
    }

    async checkAddCash(body: any): Promise<any> {
        return { status: "Add cash rules checked" };
    }

    async checkModifyPortfolio(body: any): Promise<any> {
        return { status: "Modify portfolio rules checked" };
    }
}