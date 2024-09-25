import { AlertDto } from "./dto/alert.dto";
import { OrderDto } from "./dto/order.dto";
import { PortfolioDto } from "./dto/portfolio.dto";
import { Portfolio } from "./model/portfolio.model";
import { Order } from "src/model/order.model";

interface DashboardCard {
    portfolioId: string,
    clientName: string,
    portfolioName: string,
    riskAppetite: string,
    totalValue: number,
    totalPL: number,
    totalPLPercentage: number,
    dailyPL: number,
    dailyPLPercentage: number,
    rateOfReturn: number,
    alertsPresent: boolean
}

interface FinanceNewsItem {
    newsId: number;
    newsName: string;
    newsSource: string;
    newsDescription: string;
    newsDate: string;
    newsSourceLink: string;
};

interface PortfolioAnalysis {
    totalAssets: number;
    dailyPL: number;
    dailyPLPercentage: number;
    totalPL: number;
    totalPLPercentage: number;
    annualizedRoR: number;
};

interface PortfolioBreakdown {
    industry: { [key: string]: number | undefined }[];
    geography: { [key: string]: number | undefined }[];
    securities: { [key: string]: number | undefined }[];
};

interface PortfolioHoldings {
    name: string;
    ticker: string;
    type: string;
    geography: string;
    position: number;
    market: number;
    last: number;
    cost: number;
    totalPL: number;
    totalPLPercentage: number;
    dailyPL: number;
    dailyPLPercentage: number;
    positionsRatio: number;
};

interface PortfolioData {
    portfolioId: string;
    clientName: string;
    portfolioName: string;
    portfolioAnalysis: PortfolioAnalysis;
    triggeredAlerts: AlertDto[];
    portfolioBreakdown: PortfolioBreakdown;
    portfolioHoldings: PortfolioHoldings[];
    orderExecutionProgress: OrderExecutionProgress[];
};

interface OrderExecutionProgress {
    name: string;
    ticker: string;
    position: number;
    last: number;
    price: number;
    orderType: string;
    orderStatus: string;
    orderDate: Date;
};

interface CalculatedPortfolio {
    portfolio: Portfolio,
    dailyPL: number,
    totalPL: number,
    dailyPLPercentage: number,
    totalPLPercentage: number,
    totalValue: number
}

interface ProposedPortfolio {
    portfolioId: string,
    orders: OrderDto[]
}

interface GeneratedInsight {
    title: string;
    content: string | NestedInsight[];

}
interface NestedInsight {
    subtitle: string;
    content: string;
}
interface NestedSummary {
    [key: string]: string | object[]
}
interface GeneratedSummary {
    title: string
    content: string | NestedSummary
}

interface FinanceNewsCard {
    id: string;
    company: string;
    ticker: string;
    sentimentRating: number;
    introduction: string;
}

interface NewsArticle {
    id: string;
    company: string;
    ticker: string;
    sentimentRating: number;
    insights: GeneratedInsight[];
    references: string[];
}

export type {
    DashboardCard, FinanceNewsItem,
    OrderExecutionProgress, PortfolioAnalysis,
    PortfolioBreakdown, PortfolioData, PortfolioHoldings, CalculatedPortfolio,
    ProposedPortfolio, GeneratedInsight, GeneratedSummary, NestedSummary, FinanceNewsCard, NewsArticle, NestedInsight
};
