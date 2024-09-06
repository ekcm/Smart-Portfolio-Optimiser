from yahoo_fin.stock_info import get_data
from datetime import date
from datetime import timedelta, datetime
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

load_dotenv(dotenv_path="../../.env")
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

# dow_list_info = {
#     "AAPL":["Apple", "Information Technology"],
#     "AMGN":["Amgen", "Biopharmaceutical"],
#     "AXP": ["American Express", "Financial Services"],
#     "BA": ["Boeing", "Aerospace and defense"],
#     "CAT": ["Caterpillar", "Construction and mining"],
#     "CRM": ["Salesforce", "Information Technology"],
#     "CSCO": ["Cisco", "Information Technology"],
#     "CVX": ["Chevron", "Petroleum Industry"],
#     "DIS": ["Disney", "Broadcasting and Entertainment"],
#     "DOW": ["Dow", "Chemical Industry"],
#     "GS": ["Goldman Sachs", "Financial Services"],
#     "HD": ["Home Depot", "Home Improvement"],
#     "HON": ["Honeywell", "Conglomerate"],
#     "IBM": ["IBM", "Information Technology"],
#     "INTC": ["Intel", "Semiconductor Industry"],
#     "JNJ": ["Johnson & Johnson", "Pharmaceutical Industry"],
#     "JPM": ["JPMorgan Chase", "Financial Services"],
#     "KO": ["Coca-Cola", "Drink Industry"],
#     "MCD": ["Mcdonalds", "Food Industry"],
#     "MMM": ["3M", "Conglomerate"],
#     "MRK": ["Merck", "Pharmaceutical Industry"],
#     "MSFT": ["Microsoft", "Information Technology"],
#     "NKE": ["Nike", "Clothing Industry"],
#     "PG": ["Procter & Gamble", "Fast-moving consumer goods"],
#     "TRV": ["Travelers", "Insurance"],
#     "UNH": ["UnitedHealth Group", "Managed health care"],
#     "V": ["Visa", "Financial Services"],
#     "VZ": ["Verizon", "Telecommunications Industry"],
#     "WBA": ["Walgreens Boots Alliance", "Retailing"],
#     "WMT": ["Walmart", "Retailing"]
# }

dow_list_info = {
    "AAPL":["Apple", "Information Technology"],
    "AMGN":["Amgen", "Biopharmaceutical"],
    "AXP": ["American Express", "Financial Services"],
    "BA": ["Boeing", "Aerospace and defense"],
    "CAT": ["Caterpillar", "Construction and mining"]
}

class StockItem(BaseModel):
    stock: str
    date: Optional[datetime] = None

class StockDate(BaseModel):
    date: Optional[datetime] = None

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
  stock_data =  get_stock_info(stock_item.stock, stock_item.date)
  try:
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
        stock_info = get_stock_info(stock, stock_date.date)
        try:
            with MongoClient(uri) as client:
                database = client.get_database("FYP-Test-DB")
                assetPrice = database.get_collection("AssetPrice")
                assetPrice.insert_one(stock_info)
        except Exception as e:
            return {"error": str(e)}
    return {"data": "All stocks were added successfully!"}

@app.delete("/delete_data")
def delete_data():
    '''
    deletes all data from the AssetPrice collection in the MongoDB database
    '''
    try:
        with MongoClient(uri) as client:
            database = client.get_database("FYP-Test-DB")
            assetPrice = database.get_collection("AssetPrice")
            assetPrice.delete_many({})
            return {"data": "All data was deleted successfully!"}
    except Exception as e:
        return {"error": str(e)}


if __name__ == "__main__":
    uvicorn.run("stock_service:app", host='127.0.0.1', port=5001, reload=True)

