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

load_dotenv(dotenv_path=".env")
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

bond_list_info = {
    "^TNX": ["CBOE Interest Rate 10 Year", "Government Bonds"],
    "^IRX": ["13 Week Treasury Bill", "Government Bonds"],
    "^FVX": ["Treasury Yield 5 Years", "Government Bonds"],
    "^TYX": ["Treasury Yield 30 Years", "Government Bonds"],
}

class BondItem(BaseModel):
    bond: str
    date: Optional[datetime] = None

class BondDate(BaseModel):
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

@app.get("/bonds/{bond}")
def get_bond_info(bond, date: Optional[datetime] = None):
    if date is None:
        date = datetime.now()

    if date.weekday() == 5 or date.weekday() == 6:
        return {"error": "No trading data available on weekends"}
    if bond not in bond_list_info:
        return {"error": "Invalid bond symbol"}

    try:
        today, yesterday, previousday = get_trading_days(date)
        bond_info_today = get_data(bond, start_date=yesterday, end_date=today, index_as_date=True, interval="1d")
        bond_info_yesterday = get_data(bond, start_date=previousday, end_date=yesterday, index_as_date=True, interval="1d")
        bond_data = {
            "ticker": bond,
            "company": bond_list_info[bond][0],
            "sector": bond_list_info[bond][1],
            "todayClose": bond_info_today["close"].iloc[-1],
            "yesterdayClose": bond_info_yesterday["close"].iloc[-1],
            "date": today
        }

        return bond_data
    except Exception as e:
        return {"error": str(e)}
        pass

@app.post("/insert_all")
def insert_all(bond_date: BondDate):

    for bond in bond_list_info.keys():

        bond_list = []
        bond_info = get_bond_info(bond, bond_date.date)
        bond_list.append(bond_info)

        if bond_info is None:
            print(f"error: NoneType occurred on {bond_date.date}")
            return {f"error: NoneType occurred on {bond_date.date}"}

        if "error" in bond_info:
            print(f"error: {bond_info['error']}")
            return {f"error: {bond_info['error']}"}

        try:
            with MongoClient(uri) as client:
                database = client.get_database("FYP-Test-DB")
                assetPrice = database.get_collection("AssetPrice")
                assetPrice.insert_one(bond_info)
        except Exception as e:
            return {"error": str(e)}
            pass
    
    return {"message": "Data inserted successfully"}

@app.post("/insert_all_date_range")
def insert_all_date_range():
    errors = []
    dates = []

    for i in range(1, 32):
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
            bond_date = BondDate(date=date)
            print(f"{date} is being inserted")
            result = insert_all(bond_date)
            if "error" in result:
                errors.append({"date": date, "error": result["error"]})
    except Exception as e:
        return {"error": str(e)}
    return {"data": "All bonds were added successfully", "errors": errors}

if __name__ == "__main__":
    uvicorn.run("bond_service:app", host='127.0.0.1', port=5005, reload=True)