from dotenv import load_dotenv
import os
from datetime import date, timedelta, datetime
from yahoo_fin.stock_info import get_data
from pymongo import MongoClient

load_dotenv()
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

    # if today is a weekend, do not get data
    if today.weekday() == 5 or today.weekday() == 6:
        pass
    else:
        # if today is Monday
        if today.weekday() == 0:
            yesterday = today - timedelta(days=3)
            previousday = today - timedelta(days=4)
        # if today is Tuesday
        elif today.weekday() == 1:
            yesterday = today - timedelta(days=1)
            previousday = today - timedelta(days=4)
        else:
            yesterday = today - timedelta(days=1)
            previousday = today - timedelta(days=2)
    
    return today, yesterday, previousday

def get_stock_info(stock):
    date = datetime.now()

    if date.weekday() == 5 or date.weekday() == 6:
        date = date - timedelta(days=1)
        # return {"error": "Cannot insert data on weekends"}

    try: 
        today, yesterday, previousday = get_trading_days(date)
        stock_info_today = get_data(stock, start_date=yesterday, end_date=today, index_as_date = True, interval="1d")
        stock_info_yesterday = get_data(stock, start_date=previousday, end_date=yesterday, index_as_date = True, interval="1d")
        stock_data = {
            "ticker": stock,
            "company": dow_list_info[stock][0],
            "sector": dow_list_info[stock][1],
            "todayClose": stock_info_today["close"].iloc[-1],
            "yesterdayClose": stock_info_yesterday["close"].iloc[-1],
            "date": today
        }

        return stock_data
    except Exception as e:
        return {"error": str(e)}

def lambda_handler(event, context):
    
    stock_info = get_stock_info("AAPL")
    try:
        if "error" in stock_info:
            return {
                'statusCode': 500,
                'body': stock_info
            }
        else:
            with MongoClient(uri) as client:
                database = client.get_database("FYP-Test-DB")
                collection = database.get_collection("AssetPrice")
                collection.insert_one(stock_info)

            return {
                'statusCode': 200,
                'body': stock_info
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'body': str(e)
        }

# if __name__ == "__main__":
#     print(lambda_handler(None, None))