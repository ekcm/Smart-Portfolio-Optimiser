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

llm = ChatOpenAI(model="gpt4o")
client = OpenAI()

class Query(BaseModel):
    query: str

async def researcher_response(query, sector):
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

    with open(f"sector_reports/{sector}_research_report.txt", "w") as file:
        file.write(research_report)

    with open(f"sector_reports/{sector}_research_report.json", "w") as file:
        file.write(json_data)

    return json_obj

@app.post("/sector_news")
async def retrieve_sector_news():
    information_technology_researcher = await researcher_response("Give financial news information about the Information Technology sector for the week starting on 2 September, and give a summary of key events surrounding the sector. Afterwards, include information about the following stock tickers: AAPL, CRM, CSCO, IBM, MSFT", "Information Technology")
    financial_services_researcher = await researcher_response("Give financial news information about the Financial Services sector for the week starting on 2 September, and give a summary of key events surrounding the sector. Afterwards, include information about the following stock tickers: AXP, GS, JPM, V", "Financial Services")
    retail_researcher = await researcher_response("Give financial news information about the Retail sector for the week starting on 2 September, and give a summary of key events surrounding the sector. Afterwards, include information about the following stock tickers: WBA, WMT", "Retailing")
    
    sector_news = {
        "DateRange": "2 September",
        "Information Technology": information_technology_researcher,
        "Financial Services": financial_services_researcher,
        "Retailing": retail_researcher
    }

    sector_news = json.dumps(sector_news, indent=2)

    with open(f"sector_reports/sector_news.json", "w") as file:
        file.write(sector_news)

    sector_news_json = json.loads(sector_news)

    try:
        with MongoClient(uri) as client:
            database = client.get_database("FYP-Test-DB")
            collection = database.get_collection("FinanceNews")
            collection.insert_one(sector_news_json)
    except Exception as e:
        return {"error": str(e)}
    
    return {"data": "Sector news added successfully!"}

if __name__ == "__main__":
    uvicorn.run("finance_news_sector:app", host='127.0.0.1', port=5002, reload=True)