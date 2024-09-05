interface PortfolioItem {
    portfolioId: number;
    clientName:  string;
    portfolioName: string;
    totalValue: string;
    riskAppetite: string;
    dailyPL: number;
    totalPL: number;
    rateOfReturn: number;
    alert: boolean;
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
    industry: { [key: string]: number | undefined}[];
    geography: { [key: string]: number | undefined}[];
    securities: { [key: string]: number | undefined}[];
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
  PL: number;
  dailyPL: number;
  positionsRatio: number;
};

interface PortfolioHoldingsDifference extends PortfolioHoldings {
  difference: number;
};

interface OrderExecutionProgress {
  name: string;
  ticker: string;
  type: string;
  geography: string;
  position: number;
  market: number;
  last: number;
  cost: number;
  orderType: string;
  progress: string;
};

interface PortfolioData {
  portfolioId: number;
  portfolioName: string;
  clientName: string;
  portfolioAnalysis: PortfolioAnalysis;
  triggeredAlerts: string[];
  portfolioBreakdown: PortfolioBreakdown;
  portfolioHoldings: PortfolioHoldings[];
  orderExecutionProgress: OrderExecutionProgress[];
};

// Orders Checkout component
interface AssetsItem {
  name: string;
  ticker: string;
  type: string;
  geography: string;
  position: number;
  market: number;
  last: number;
  cost: number;
  orderType: string;
};

interface AddTransactionDataType {
    type: string;
    name: string;
    cost: number;
    position: number;
    orderType: string;
}

export type {
    PortfolioItem,
    FinanceNewsItem,
    PortfolioAnalysis,
    PortfolioBreakdown,
    PortfolioHoldings,
    PortfolioHoldingsDifference,
    OrderExecutionProgress,
    PortfolioData,
    AssetsItem,
    AddTransactionDataType
}