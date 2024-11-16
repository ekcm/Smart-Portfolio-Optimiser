import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from gpt_researcher import GPTResearcher
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel
import json
import markdown_to_json 
from openai import OpenAI
from datetime import datetime
from pymongo import MongoClient

load_dotenv(dotenv_path="../.env")
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")
os.environ["TAVILY_API_KEY"] = os.getenv("TAVILY_API_KEY")
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
    "WMT": ["Walmart", "Retailing"]
}

client = OpenAI()

class Stock(BaseModel):
    ticker: str

@app.get("/")
def read_root():
    return {"Status": "Finance News Service is running!"}

async def researcher_response(query, ticker):
    researcher = GPTResearcher(query=query, report_type="research_report")
    research_result = await researcher.conduct_research()
    research_report = await researcher.write_report()

    lines = research_report.split("\n")
    reformatted_md_text = ""
    for line in lines:
        if not line.startswith("# "):
            reformatted_md_text += line + "\n"

    json_data = markdown_to_json.dictify(reformatted_md_text)
    json_data = json.dumps(json_data, indent=2)
    json_obj = json.loads(json_data)

    return json_obj

async def generate_sentiment_analysis(ticker, extracted_text, references):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Your role is to perform sentiment analysis on the extracted text."},
            {"role": "user", "content": f'''
                ### Instruction ###
                Perform sentiment analysis on the extracted text. Return the output as:
                - Extremely Positive
                - Positive
                - Neutral
                - Negative
                - Extremely Negative

                Text: {extracted_text}.
            '''
            }
        ],
        temperature=0,    
    )
    sentiment_analysis = response.choices[0].message.content

    if "Extremely Positive" in sentiment_analysis:
        sentimentRating = 5
    elif "Positive" in sentiment_analysis:
        sentimentRating = 4
    elif "Negative" in sentiment_analysis:
        sentimentRating = 2
    elif "Extremely Negative" in sentiment_analysis:
        sentimentRating = 1
    else:
        sentimentRating = 3

    sentiment_analysis_json = {
        "ticker": ticker,
        "date": datetime.now(),
        "sentimentRating": sentimentRating,
        "summary": extracted_text,
        "references": references
    }

    return sentiment_analysis_json

def insert_into_mongo(json_obj):
    try:
        with MongoClient(uri) as client:
            database = client.get_database("FYP-Test-DB")
            alerts = database.get_collection("FinanceNews")
            alerts.insert_one(json_obj)
    except Exception as e:
        return {"error": str(e)}
    
    return {"data": "Alert created successfully!"}

@app.post("/")
async def retrieve_finance_news(Stock: Stock):
    ticker = Stock.ticker
    date = datetime.now()
    query = f"Give financial news information about the {ticker} stock on {date}, and give a summary of key events surrounding the stock."
    stock_researcher = await researcher_response(query, ticker)
    last_key, last_value = list(stock_researcher.items())[-1]
    if not isinstance(last_value, list):
        last_value = [last_value]

    updated_json_obj = []
    for key, value in list(stock_researcher.items())[:-1]:
        temp_dict = {}
        temp_dict["title"] = key
        temp_dict["content"] = value
        updated_json_obj.append(temp_dict)

    sentiment_analysis_entry = await generate_sentiment_analysis(ticker, updated_json_obj, last_value)
    
    result = insert_into_mongo(sentiment_analysis_entry)
    return result

@app.post("/finance_news")
async def retrieve_all_finance_news():
    for ticker in dow_list_info.keys():
        result = await retrieve_finance_news(Stock(ticker=ticker))

    return result

@app.delete("/")
def delete_finance_news():
    try:
        with MongoClient(uri) as client:
            database = client.get_database("FYP-Test-DB")
            alerts = database.get_collection("FinanceNews")
            alerts.delete_many({})
            return {"data": "Finance news deleted successfully!"}
    except Exception as e:
        return {"error": str(e)}


if __name__ == "__main__":
    uvicorn.run("finance_news_service:app", host='127.0.0.1', port=5004, reload=True)