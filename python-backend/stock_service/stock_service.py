from yahoo_fin.stock_info import get_data
from datetime import date, timedelta, datetime
from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
import yahoo_fin.stock_info as si
import json
import uvicorn
import requests
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import Optional
import random

load_dotenv(dotenv_path="../.env")
uri = os.getenv("MONGO_URI")

app = FastAPI()

# Allow all origins
origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

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
    "WMT": ["Walmart", "Retailing"],
    "^TNX": ["CBOE Interest Rate 10 Year", "Government Bonds"],
    "^IRX": ["13 Week Treasury Bill", "Government Bonds"],
    "^FVX": ["Treasury Yield 5 Years", "Government Bonds"],
    "^TYX": ["Treasury Yield 30 Years", "Government Bonds"],
}

class StockItem(BaseModel):
    stock: str
    date: Optional[datetime] = None

class StockDate(BaseModel):
    date: Optional[datetime] = None

@app.get("/")
def read_root():
    return {"Status": "Stock Service is running!"}

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

@app.get("/stock/{stock}")
def get_stock_info(stock, date: Optional[datetime] = None):
    '''
    retrieves a specific stock from yfinance and returns the data
    '''
    if date is None:
      date = datetime.now()
    #   date = date - timedelta(1)
    
    if date.weekday() == 5 or date.weekday() == 6:
        return {"error": "Cannot insert data on weekends"}
    if stock not in dow_list_info.keys():
        return {"error": "Stock not in list"}

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
        # return {"error": str(e)}
        pass

@app.get("/retrieve_data")
def retrieve_data():
  '''
  retrieves data from the AssetPrice collection in the MongoDB database
  '''
  try:
        with MongoClient(uri) as client:
            database = client.get_database("FYP-Test-DB")
            assetPrice = database.get_collection("AssetPrice")
            data = assetPrice.find()

            records = []
            for record in data:
                record["_id"] = str(record["_id"])
                record = jsonable_encoder(record)
                records.append(record)
            client.close()
        return {"data": records}
  except Exception as e:
      return {"error": str(e)}

@app.post("/insert_stock")
def insert_stock(stock_item: StockItem):  
  '''
  insert a stock into the AssetPrice collection in the MongoDB database
  '''
  stock_data = get_stock_info(stock_item.stock, stock_item.date)
  try:
        if "error" in stock_data:
            print("error: ", stock_data["error"], "date: ", stock_item.date)
            pass
        else:
            with MongoClient(uri) as client:
                database = client.get_database("FYP-Test-DB")
                assetPrice = database.get_collection("AssetPrice")
                assetPrice.insert_one(stock_data)
                return {"data": f"stock {stock_item.stock} was added successfully!"}
  except Exception as e:
      return {"error": str(e)}

  
@app.post("/insert_all")
def insert_all(stock_date: StockDate):
    '''
    insert all stocks into the AssetPrice collection in the MongoDB database
    '''
    
    for stock in dow_list_info.keys():

        stock_list = []
        stock_info = get_stock_info(stock, stock_date.date)
        stock_list.append(stock_info)

        if stock_info is None:
            print(f"error: NoneType occurred on {stock_date.date}")
            return {"error": f"NoneType occurred on {stock_date.date}"}

        if "error" in stock_info:
            print("error: ", stock_info["error"])
            return {"error": stock_info["error"]}

        # # stock_info only has one hour, but we want an additional 6 hours
        # current_stock_date = stock_info["date"]
        # original_todayClose = stock_info["todayClose"]
        # current_todayClose = stock_info["todayClose"]
        # current_yesterdayClose = stock_info["yesterdayClose"]

        # last_day = 7

        # for i in range(1, last_day):
        #     new_stock_date = current_stock_date + timedelta(hours=i)

        #     # randomize todayClose
        #     new_YesterdayClose = current_todayClose
        #     current_todayClose = new_YesterdayClose * (1+random.uniform(-0.05, 0.05))

        #     new_stock_info = {
        #         "ticker": stock_info["ticker"],
        #         "company": stock_info["company"],
        #         "sector": stock_info["sector"],
        #         "todayClose": current_todayClose,
        #         "yesterdayClose": new_YesterdayClose,
        #         "date": new_stock_date
        #     }   

        #     if last_day-1 == i:
        #         new_stock_info = {
        #             "ticker": stock_info["ticker"],
        #             "company": stock_info["company"],
        #             "sector": stock_info["sector"],
        #             "todayClose": original_todayClose,
        #             "yesterdayClose": new_YesterdayClose,
        #             "date": new_stock_date
        #         }   

        #     stock_list.append(new_stock_info)
            
        # print(stock_list)
        for stock_info in stock_list:
            # print(new_stock_info)
            try:
                if "error" in stock_info:
                    print("error: ", stock_info["error"], "date: ", stock_info.date)
                    pass
                else:
                    with MongoClient(uri) as client:
                        database = client.get_database("FYP-Test-DB")
                        assetPrice = database.get_collection("AssetPrice")
                        assetPrice.insert_one(stock_info)
            except Exception as e:
                return {"error": str(e)}

    return {"data": "All stocks were added successfully!"}

@app.post("/insert_all_date_range")
def insert_all_date_range():
    '''
    inserts stocks for a range of dates into the AssetPrice collection
    '''
    errors = []
    dates = []

    for i in range(1, 32):
        jan_date = datetime(2024, 1, i)
        dates.append(jan_date)

    for i in range(1, 30):
        feb_date = datetime(2024, 2, i)
        dates.append(feb_date)

    for i in range(1, 32):
        mar_date = datetime(2024, 3, i)
        dates.append(mar_date)

    for i in range(1, 31):
        apr_date = datetime(2024, 4, i)
        dates.append(apr_date)

    for i in range(1, 32):
        may_date = datetime(2024, 5, i)
        dates.append(may_date)

    for i in range(1, 31):
        jun_date = datetime(2024, 6, i)
        dates.append(jun_date)

    for i in range(1, 32):
        july_date = datetime(2024, 7, i)
        dates.append(july_date)

    for i in range(1,32):
        aug_date = datetime(2024, 8, i)
        dates.append(aug_date)

    for i in range(1, 31):
        sep_date = datetime(2024, 9, i)
        dates.append(sep_date)

    for i in range(1, 32):
        oct_date = datetime(2024, 10, i)
        dates.append(oct_date)

    try:
        for date in dates:
            stock_date = StockDate(date=date)
            print(f"{date} is being inserted")
            result = insert_all(stock_date)
            if "error" in result:
                errors.append({"date": date, "error": result["error"]})
    except Exception as e:  
        return {"error": str(e)}
    return {"data": "All stocks were added successfully!", "errors": errors}

@app.delete("/delete_data")
def delete_data():
    '''
    deletes all data from the AssetPrice collection in the MongoDB database
    '''
    try:
        with MongoClient(uri, connectTimeoutMS=60000, socketTimeoutMS=60000) as client:
            client.admin.command("ping")
            database = client.get_database("FYP-Test-DB")
            assetPrice = database.get_collection("AssetPrice")
            result = assetPrice.delete_many({})
            print(f"{result.deleted_count} documents deleted")
            return {"data": "All data was deleted successfully!"}
    except Exception as e:
        return {"error": str(e)}

@app.delete("/delete_data_by_date")
def delete_data_by_date():
    '''
    Deletes all data from the AssetPrice collection in the MongoDB database for a specific date.
    '''
    target_date = datetime(2024, 7, 4)  # Specify the date to delete in YYYY-MM-DD format
    end_of_day = target_date + timedelta(hours=23, minutes=59, seconds=59)

    try:
        with MongoClient(uri, connectTimeoutMS=60000, socketTimeoutMS=60000) as client:
            database = client.get_database("FYP-Test-DB")
            assetPrice = database.get_collection("AssetPrice")
            
            # Use the $eq operator to match the exact date
            # result = assetPrice.delete_many({"date": target_date})
            result = assetPrice.delete_many({"date": {"$gte": target_date, "$lt": end_of_day}})
            
            return {
                "data": f"Deleted {result.deleted_count} documents for the date {target_date.strftime('%Y-%m-%d')}."
            }
    except Exception as e:
        return {"error": str(e)}

def insert_all_json(stock_date: StockDate):
    ''' 
    generates a JSON file with stock data for a specific date
    '''

    stock_list = []
    for stock in dow_list_info.keys():
        print(f"Inserting {stock} on {stock_date.date}")

        # stock_list = []
        stock_info = get_stock_info(stock, stock_date.date)

        if stock_info is None:
            print(f"error: NoneType occurred on {stock_date.date}")
            return {"error": f"NoneType occurred on {stock_date.date}"}
        
        if "error" in stock_info:
            print("error: ", stock_info["error"])
            return {"error": stock_info["error"]}

        first_entry_stock_info = {
            "ticker": stock_info["ticker"],
            "company": stock_info["company"],
            "sector": stock_info["sector"],
            "todayClose": float(stock_info["todayClose"]),
            "yesterdayClose": float(stock_info["yesterdayClose"]),
            "date": stock_info["date"].isoformat()
        }
        stock_list.append(first_entry_stock_info)

        # stock_info only has one hour, but we want an additional 6 hours
        current_stock_date = stock_info["date"]
        original_todayClose = stock_info["todayClose"]
        current_todayClose = stock_info["todayClose"]
        current_yesterdayClose = stock_info["yesterdayClose"]

        last_day = 7

        for i in range(1, last_day):
            new_stock_date = current_stock_date + timedelta(hours=i)
        
            # randomize todayClose
            new_YesterdayClose = current_todayClose
            current_todayClose = new_YesterdayClose * (1+random.uniform(-0.05, 0.05))

            new_stock_info = {
                "ticker": stock_info["ticker"],
                "company": stock_info["company"],
                "sector": stock_info["sector"],
                "todayClose": float(current_todayClose),
                "yesterdayClose": float(new_YesterdayClose),
                "date": new_stock_date.isoformat()
            }

            if last_day-1 == i:
                new_stock_info = {
                    "ticker": stock_info["ticker"],
                    "company": stock_info["company"],
                    "sector": stock_info["sector"],
                    "todayClose": float(original_todayClose),
                    "yesterdayClose": float(new_YesterdayClose),
                    "date": new_stock_date.isoformat()
                }

            stock_list.append(new_stock_info)

    return stock_list


@app.post("/generate_json")
def generate_json():
    '''
    Generates a JSON file with stock data for a specific date.
    '''
    errors = []
    dates = []
    
    for i in range(1, 2):
        july_date = datetime(2024, 11, i)
        dates.append(july_date)

    json_data = {}

    try:
        for date in dates:
            stock_date = StockDate(date=date)
            print(f"{date} is being inserted")

            result = insert_all_json(stock_date)
            if "error" in result:
                pass
            else:
                json_data[date.isoformat()] = result

            if "error" in result:
                errors.append({"date": date, "error": result["error"]})
                
    except Exception as e:
        return {"error": str(e)}

    with open("stock_data.json", "w") as f:
        json.dump(json_data, f, indent=4)
    return {"data": "All stocks were added successfully!", "errors": errors}

if __name__ == "__main__":
    uvicorn.run("stock_service:app", host='127.0.0.1', port=5001, reload=True)

