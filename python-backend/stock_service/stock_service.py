from yahoo_fin.stock_info import get_data
from datetime import date
from datetime import timedelta, datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import yahoo_fin.stock_info as si
import json
import uvicorn
import requests
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path="../../.env")
uri = os.getenv("MONGO_URI")
client = MongoClient(uri)

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
    "WMT": ["Walmart", "Retailing"]
}

def get_trading_days():
    today = datetime.now()
    yesterday = today - timedelta(days=1)
    previousday = today - timedelta(days=2)

    # if today is Sunday
    if today.weekday() == 6:
        today = today - timedelta(days=1)
        yesterday = today - timedelta(days=2)
        previousday = today - timedelta(days=3)
        
    # if today is Saturday
    elif today.weekday() == 5:
        today = today - timedelta(days=0)
        yesterday = today - timedelta(days=1)
        previousday = today - timedelta(days=2)
        
    return today, yesterday, previousday

@app.get("/stock")
def get_all_stock_info():
    today, yesterday, previousday = get_trading_days()
    dow_list = list(dow_list_info.keys())
    stock_info = {}
    for stock in dow_list:
        stock_info_today = get_data(stock, start_date=yesterday, end_date=today, index_as_date = True, interval="1d")
        stock_info_yesterday = get_data(stock, start_date=previousday, end_date=yesterday, index_as_date = True, interval="1d")
        stock_data = {
            "ticker": stock,
            "company": dow_list_info[stock][0],
            "sector": dow_list_info[stock][1],
            "todayClose": stock_info_today["close"].iloc[-1],
            "yesterdayClose": stock_info_yesterday["close"].iloc[-1],
            "date": datetime.now()
        }

        # Send data to NestJS backend to insert into the AssetPrice collection
        # response = requests.post("http://localhost:8000/assetprice", json=stock_data)  # Ensure this URL matches your NestJS API

        # if response.status_code != 201:  # Check if creation was successful
        #     print(f"Failed to insert data for {stock}: {response.text}")
        # else:
        #     print(f"Successfully inserted data for {stock}")

        stock_info[stock] = stock_data

    return stock_info

@app.get("/stock/{stock}")
def get_stock_info(stock):
    today, yesterday, previousday = get_trading_days()
    stock_info_today = get_data(stock, start_date=yesterday, end_date=today, index_as_date = True, interval="1d")
    stock_info_yesterday = get_data(stock, start_date=previousday, end_date=yesterday, index_as_date = True, interval="1d")
    stock_data = {
        "ticker": stock,
        "company": dow_list_info[stock][0],
        "sector": dow_list_info[stock][1],
        "todayClose": stock_info_today["close"].iloc[-1],
        "yesterdayClose": stock_info_yesterday["close"].iloc[-1],
        "date": datetime.now()
    }

    # Send data to NestJS backend to insert into the AssetPrice collection
    # response = requests.post(f"http://localhost:8000/assetprice", json=stock_data)  # Ensure this URL matches your NestJS API

    # if response.status_code != 201:  # Check if creation was successful
    #     print(f"Failed to insert data for {stock}: {response.text}")
    # else:
    #     print(f"Successfully inserted data for {stock}")

    return stock_data

@app.get("/retrieve_data")
def retrieve_data():
  try:
      database = client.get_database("FYP-Test-DB")
      assetPrice = database.get_collection("AssetPrice")
      data = assetPrice.find()
      for record in data:
          print(record)
          print(type(record['date']))
      client.close()
      return {"data": "Success"}

  except Exception as e:
      return {"error": str(e)}
  
@app.post("/insert_data")
def insert_data():
    stock_info = get_stock_info("AAPL")
    try:
        database = client.get_database("FYP-Test-DB")
        assetPrice = database.get_collection("AssetPrice")
        assetPrice.insert_one(stock_info)
        client.close()
        return {"data": "Success"}
    except:
        return {"error": "An error occurred"}

if __name__ == "__main__":
    uvicorn.run("stock_service:app", host='127.0.0.1', port=5001, reload=True)
