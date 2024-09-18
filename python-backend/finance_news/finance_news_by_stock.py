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

load_dotenv(dotenv_path="../../.env")
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

class Query(BaseModel):
    query: str


def insert_into_mongo(json_obj):
    try:
        with MongoClient(uri) as client:
            database = client.get_database("FYP-Test-DB")
            alerts = database.get_collection("Alerts")
            alerts.insert_one(json_obj)
    except Exception as e:
        return {"error": str(e)}
    
    return {"data": "Alert created successfully!"}

async def researcher_response(query, stock):
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

    with open(f"reports/stock/{stock}_research_report.txt", "w") as file:
        file.write(research_report)

    with open(f"reports/stock/{stock}_research_report.json", "w") as file:
        file.write(json_data)

    return json_obj

async def generate_sentiment_analysis(json_obj, stock):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Your role is to perform sentiment analysis on the extracted text."},
            {"role": "user", "content": f'''
                ### Instruction ###
                Perform sentiment analysis on the extracted text. Return the output as Positive, Negative, or Neutral.
                Text: {json_obj}.
            '''
            }
        ],
        temperature=0,
    )
    sentiment_analysis = response.choices[0].message.content

    sentiment_analysis_classification = 2
    if "Negative" in sentiment_analysis:
        sentiment_analysis_classification = 1
    elif "Positive" in sentiment_analysis:
        sentiment_analysis_classification = 3
    sentiment_analysis_json = {
        "stock": stock,
        "date": datetime.now(),
        "sentiment_analysis_classification": sentiment_analysis_classification,
        "finance_news": json_obj,
    }

    result = insert_into_mongo(sentiment_analysis_json)

    return result

@app.post("/alert")
async def retrieve_stock_news():
    date = datetime.now()
    for stock in dow_list_info:
        stock_researcher = await researcher_response(f"Give financial news information about the {stock} stock on {date}, and give a summary of key events surrounding the stock.", stock)
        sentiment_analysis = await generate_sentiment_analysis(stock_researcher, stock)
    return {"message": "Alerts successfully generated!"}

@app.delete("/delete_alerts")
def delete_alerts():
    try:
        with MongoClient(uri) as client:
            database = client.get_database("FYP-Test-DB")
            alerts = database.get_collection("Alerts")
            alerts.delete_many({})
            return {"data": "Alerts deleted successfully!"}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run("finance_news_by_stock:app", host='127.0.0.1', port=5002, reload=True)