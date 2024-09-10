interface PortfolioItem {
    portfolioId: string;
    clientName:  string;
    portfolioName: string;
    totalValue: number;
    riskAppetite: string;
    dailyPL: number;
    dailyPLPercentage: number,
    totalPLPercentage: number,
    totalPL: number;
    rateOfReturn: number;
    alertsPresent: boolean;
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
  totalPL: number;
  totalPLPercentage: number;
  dailyPLPercentage: number;
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
  portfolioId: string;
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