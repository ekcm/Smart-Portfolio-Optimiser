from yahoo_fin.stock_info import get_data
from datetime import date
from datetime import timedelta, datetime
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path=".env")
uri = os.getenv("MONGO_URI")

dow_list_info = {
    "AAPL":["Apple", "Information Technology"],
    "AMGN":["Amgen", "Biopharmaceutical"],
    "AXP": ["American Express", "Financial Services"],
    "BA": ["Boeing", "Aerospace and defense"],
    "CAT": ["Caterpillar", "Construction and mining"],
    "CRM": ["Salesforce", "Information Technology"],
    "CSCO": ["Cisco", "Information Technology"],
    "CVX": ["Chevron", "Petroleum Industry"],
    "DIS": ["Disney", "Broadcasting and Entertainment"],
    "DOW": ["Dow", "Chemical Industry"],
    "GS": ["Goldman Sachs", "Financial Services"],
    "HD": ["Home Depot", "Home Improvement"],
    "HON": ["Honeywell", "Conglomerate"],
    "IBM": ["IBM", "Information Technology"],
    "INTC": ["Intel", "Semiconductor Industry"],
    "JNJ": ["Johnson & Johnson", "Pharmaceutical Industry"],
    "JPM": ["JPMorgan Chase", "Financial Services"],
    "KO": ["Coca-Cola", "Drink Industry"],
    "MCD": ["Mcdonalds", "Food Industry"],
    "MMM": ["3M", "Conglomerate"],
    "MRK": ["Merck", "Pharmaceutical Industry"],
    "MSFT": ["Microsoft", "Information Technology"],
    "NKE": ["Nike", "Clothing Industry"],
    "PG": ["Procter & Gamble", "Fast-moving consumer goods"],
    "TRV": ["Travelers", "Insurance"],
    "UNH": ["UnitedHealth Group", "Managed health care"],
    "V": ["Visa", "Financial Services"],
    "VZ": ["Verizon", "Telecommunications Industry"],
    "WBA": ["Walgreens Boots Alliance", "Retailing"],
    "WMT": ["Walmart", "Retailing"]
}

def get_trading_days(today):
    yesterday = today - timedelta(days=1)
    previousday = today - timedelta(days=2)
    return today, yesterday, previousday

def get_stock_data(stock):
    date = datetime.now()

    try:
        today, yesterday, previousday = get_trading_days(date)
        stock_data = get_data(stock, start_date=yesterday, end_date=today, index_as_date = True, interval = "1d")
        stock_data_yesterday = get_data(stock, start_date=previousday, end_date=yesterday, index_as_date = True, interval = "1d")
        stock_data = {
            "ticker": stock,
            "company": dow_list_info[stock][0],
            "sector": dow_list_info[stock][1],
            "todayClose": stock_data["close"].iloc[-1],
            "yesterdayClose": stock_data_yesterday["close"].iloc[-1],
            "date": today
        }
        return stock_data

    except Exception as e:
        pass

def insert_stock_data():
    print("Inserting stock data")
    for stock in dow_list_info.keys():
        stock_data = get_stock_data(stock)

        try:
            if "error" in stock_data:
                print("error")
                pass
            else:
                with MongoClient(uri) as client:
                    database = client.get_database("FYP-Test-DB")
                    collection = database.get_collection("AssetPriceTest")
                    collection.insert_one(stock_data)
        except Exception as e:
            print(e)
            return {"error": str(e)}

    print("Data inserted successfully")
    return {"message": "Data inserted successfully"}

def delete_stock_data():
    with MongoClient(uri) as client:
        database = client.get_database("FYP-Test-DB")
        collection = database.get_collection("AssetPriceTest")
        collection.delete_many({})
    print("Data deleted successfully")
    return {"message": "Data deleted successfully"}

if __name__ == "__main__":
    insert_stock_data()
