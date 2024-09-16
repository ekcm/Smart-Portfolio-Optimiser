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

interface PortfolioHoldingsDifference {
  name: string;
  ticker: string;
  type: string;
  geography: string;
  position: number;
  market: number;
  last: number;
  cost: number;
  totalPL: number;
  dailyPL: number;
  positionsRatio: number;
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
  orderStatus: string;
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
    ticker: string;
    cost: number;
    position: number;
    orderType: string;
}

interface Asset {
  id: string;
  ticker: string;
  name: string;
  type: string;
  geography: string;
  industry: string;
}



// API CALL TYPES
// Define the interface for the asset holdings
interface apiAssetHolding {
  ticker: string;
  cost: number;
  quantity: number;
  assetType: string;
}

interface CreateOrderItem {
  orderType: string;
  assetName: string;
  quantity: number;
  price: number;
  portfolioId: string;
}

// Define the interface for the form parameter
interface CreatePortfolioForm {
  client: string;
  portfolioName: string;
  riskAppetite: string;
  cashAmount: number;
  assetHoldings: apiAssetHolding[];
  manager: string;
  exclusions: string[];
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
    AddTransactionDataType,
    Asset,
    // API CALL TYPES
    apiAssetHolding,
    CreatePortfolioForm,
    CreateOrderItem,
}