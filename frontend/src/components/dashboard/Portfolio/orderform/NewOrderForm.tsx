import React, { useEffect, useState } from "react";
import { AddTransactionDataType, Alert, Asset, AssetsItem, intermediateAssetHoldings, PortfolioData, RuleReport } from "@/lib/types";
import PortfolioBreakdownCard from "../PortfolioBreakdownCard";
import AddTransactionCard from "./AddTransactionCard";
import OrdersCheckoutCard from "./OrdersCheckoutCard";
import { Button } from "@/components/ui/button";
import { Link as TransitionLink } from "next-view-transitions";
import Link from 'next/link';
import { fetchAllAssets, fetchAsset, fetchCurrentAssetPrice } from "@/api/asset";
import { getIntermediatePortfolioValidation, getPortfolio } from "@/api/portfolio";
import Loader from "@/components/loader/Loader";
import Error from "@/components/error/Error";
import { v4 as uuidv4 } from 'uuid';
import { viewIndivLatestNews } from "@/api/financenews";

interface NewOrderFormProps {
    data: PortfolioData;
    prevOrders?: AssetsItem[];
}

export default function NewOrderForm({ data, prevOrders }: NewOrderFormProps) {
    // loaders
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [orders, setOrders] = useState<AssetsItem[]>([]);
    const [intermediateAssetHoldings, setIntermediateAssetHoldings] = useState<intermediateAssetHoldings[]>([]);
    const [triggeredAlerts, setTriggeredAlerts] = useState<Alert[]>(data.triggeredAlerts);
    const [assetsLoading, setAssetsLoading] = useState(true);
    const [allAssets, setAllAssets] = useState<Asset[] | undefined>([]);
    const [breachedRules, setBreachedRules] = useState<RuleReport>(data.breachedRules);
    const [assetError, setAssetError] = useState<string | null>(null);
    const [cashBalance, setCashBalance] = useState<number>(0);
    const [buyingPower, setBuyingPower] = useState<number>(0);

    useEffect(() => {
        if (prevOrders) setOrders(prevOrders);
    }, [prevOrders]);

    useEffect(() => {
        getAllAssets();
        getCashBalance(data.portfolioId);
    }, [data.portfolioId]);

    const getCashBalance = async (portfolioId: string) => {
        try {
            const getPortfolioData = await getPortfolio(portfolioId);
            setCashBalance(getPortfolioData.cashAmount);
            setBuyingPower(getPortfolioData.cashAmount);
        } catch (error) {
            console.error("Error fetching cash balance: ", error);
            setError("Failed to load portfolios");
        } finally {
            setLoading(false);
        }
    }

    const getAllAssets = async () => {
        try {
            const assets = await fetchAllAssets();
            setAllAssets(assets);
        } catch (error) {
            console.error("Error fetching assets: ", error);
            setAssetError("Failed to load assets");
        } finally {
            setAssetsLoading(false);
        }
    }

    const addTransaction = async (formData: AddTransactionDataType) => {
        // console.log("Received form data in parent:", formData);
        // Call apis to get necessary asset info
        try {
            const assetTicker = formData.ticker;
            const assetInfo = await fetchAsset(assetTicker);
            const assetPrice = await fetchCurrentAssetPrice(assetTicker);

            const newOrderTotalCost = formData.cost * formData.position;
            const existingOrder = orders.find(
                (order) =>
                    order.ticker === formData.ticker &&
                    order.orderType === formData.orderType &&
                    order.cost === formData.cost
            );
            if (existingOrder) {
                const updatedOrder = {
                    ...existingOrder,
                    position: Number(existingOrder.position) + Number(formData.position),
                };
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.id === existingOrder.id ? updatedOrder : order
                    )
                );

                if (formData.orderType === "Buy") {
                    setBuyingPower((prevBalance) => prevBalance - newOrderTotalCost);
                }
            } else {
                const newOrder: AssetsItem = {
                    ...formData,
                    id: uuidv4(),
                    name: assetInfo.name,
                    geography: assetInfo.geography,
                    market: formData.cost * formData.position,
                    last: assetPrice,
                };
                setOrders([...orders, newOrder]);
                if (formData.orderType === "Buy") {
                    setBuyingPower((prevBalance) => prevBalance - newOrderTotalCost);
                }
            }
            // Add ticker alert to triggeredAlerts array
            const updatedHoldings = [...intermediateAssetHoldings];
            const existingHoldingIndex = updatedHoldings.findIndex(
                (holding) => holding.ticker === assetTicker
            );

            if (existingHoldingIndex !== -1) {
                // Update quantity for existing asset holding
                updatedHoldings[existingHoldingIndex] = {
                    ...updatedHoldings[existingHoldingIndex],
                    quantity: updatedHoldings[existingHoldingIndex].quantity + formData.position,
                };
            } else {
                // Add new asset holding if it doesn't exist
                updatedHoldings.push({
                    ticker: assetTicker,
                    cost: formData.cost,
                    quantity: formData.position,
                    assetType: assetInfo.type,
                    orderType: String(formData.orderType),
                });
            }
            console.log(updatedHoldings);
            // Set the updated holdings
            setIntermediateAssetHoldings(updatedHoldings);

            // update rules based on intermediate portfolio
            if (formData.orderType === "Buy") {
                const newRules = await getIntermediatePortfolioValidation(data.portfolioId, updatedHoldings, buyingPower - newOrderTotalCost);
                console.log(newRules);
                setBreachedRules(newRules);
            } else if (formData.orderType === "Sell") {
                const newRules = await getIntermediatePortfolioValidation(data.portfolioId, updatedHoldings, buyingPower);
                console.log(newRules);
                setBreachedRules(newRules);
            }
            const newsAlerts = await viewIndivLatestNews(formData.ticker);
            setTriggeredAlerts((prevAlerts) => [...prevAlerts, newsAlerts[0]]);
        } catch (error) {
            window.alert("An error occurred while adding the transaction. Please try again.");
        }
    }

    const deleteOrder = async(id: string, orderType: string, totalCost: number) => {
        // Remove the order from the orders list
        setOrders((prevOrders) => prevOrders.filter(order => order.id !== id));

        // Create a temporary variable for the updated holdings
        let updatedHoldings = [...intermediateAssetHoldings];

        if (orderType === "Buy") {
            // If it's a Buy order, we increase the buying power back
            setBuyingPower((prevBalance) => prevBalance + totalCost);

            // Update the intermediate asset holdings
            updatedHoldings = updatedHoldings.map((holding) => {
                if (holding.ticker === id) { 
                    holding.quantity -= totalCost;  // Decrease the quantity of the asset by the amount sold
                    // If the quantity is now 0 or negative, remove that holding
                    if (holding.quantity <= 0) {
                        return null;  // Mark this holding for removal
                    }
                }
                return holding;
            }).filter((holding) => holding !== null);  // Remove the nullified holdings

        } else if (orderType === "Sell") {
            // If it's a Sell order, we need to remove the asset from portfolio holdings
            updatedHoldings = updatedHoldings.map((holding) => {
                if (holding.ticker === id) {
                    holding.quantity -= totalCost;

                    // If the quantity reaches zero or below, remove the asset
                    if (holding.quantity <= 0) {
                        return null;  // Mark this holding for removal
                    }
                }
                return holding;
            }).filter((holding) => holding !== null);  // Remove the nullified holdings
        }

        if (orderType === "Buy") {
            const newRules = await getIntermediatePortfolioValidation(data.portfolioId, updatedHoldings, buyingPower + totalCost);
            setBreachedRules(newRules);
        } else if (orderType === "Sell") {
            const newRules = await getIntermediatePortfolioValidation(data.portfolioId, updatedHoldings, buyingPower);
            setBreachedRules(newRules);
        }
        // Set the updated holdings to the state after all modifications
        setIntermediateAssetHoldings(updatedHoldings);
    }

    if (loading) {
        return (
            <Loader />
        )
    }

    if (error) return <Error error={error} />

    return (
        <div className="flex flex-col justify-center gap-4 pb-8">
            <PortfolioBreakdownCard data={data.portfolioBreakdown} />
            <OrdersCheckoutCard data={orders} onDelete={deleteOrder} />
            <AddTransactionCard 
                portfolioId={data.portfolioId} 
                cashBalance={cashBalance} 
                buyingPower={buyingPower} 
                portfolioAssets={data.portfolioHoldings}
                assetsData={allAssets}
                triggeredAlerts={triggeredAlerts}
                ruleReport={breachedRules}
                addTransaction={addTransaction} 
            />
            <div className="flex gap-4">
                <Link
                    href={{
                        pathname: `/dashboard/${data.portfolioId}/neworder/generateorderlist`,
                        query: { orders: JSON.stringify(orders) },
                    }}
                >
                    <Button className="bg-red-500">Generate Orders List</Button>
                </Link>
                <TransitionLink href={`/dashboard/${data.portfolioId}`}>
                    <Button className="bg-gray-400">Cancel</Button>
                </TransitionLink>
            </div>
        </div>
    )
}