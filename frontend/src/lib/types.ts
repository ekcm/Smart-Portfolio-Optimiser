interface PortfolioItem {
    portfolioId: number;
    portfolioName: string;
    totalAssets: string;
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

export type {
    PortfolioItem,
    FinanceNewsItem
}