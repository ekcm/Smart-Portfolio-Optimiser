export interface Portfolio {
  portfolioId: string;
  portfolioClient: string;
  portfolioName: string;
  clientRiskAppetite: RiskAppetite;
  portfolioCashAmount: number;
}

export enum RiskAppetite {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

// missing securitiesList and transactionsList