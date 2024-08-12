export interface Order {
    orderType: OrderType;
    orderDate: Date;
    assetName: string;
    quantity: number;
    price: number;
}

export enum OrderType {
    BUY = `BUY`,
    SELL = `SELL`
}