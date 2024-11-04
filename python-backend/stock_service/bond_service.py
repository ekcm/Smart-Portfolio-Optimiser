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

if __name__ == "__main__":
    uvicorn.run("bond_service:app", host='127.0.0.1', port=5005, reload=True)