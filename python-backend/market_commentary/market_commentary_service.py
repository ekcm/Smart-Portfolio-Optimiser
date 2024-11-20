import os
import json
from dotenv import load_dotenv
from gpt_researcher import GPTResearcher
import markdown_to_json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pymongo import MongoClient
from openai import OpenAI
import re
from datetime import datetime

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

@app.get("/")
def read_root():
    return {"Status": "Market Commentary Service is running!"}

@app.post("/")
async def researcher_response():
    client = OpenAI()

    query = "Give an overview of the stocks in the DOW 30 index this week."
    researcher = GPTResearcher(query=query, report_type="research_report")
    research_result = await researcher.conduct_research()
    research_report = await researcher.write_report()

    lines = research_report.strip().split("\n")
    reformatted_md_text = ""

    for line in lines:
        if not line.startswith("# "):
            reformatted_md_text += line + "\n"

    json_data = markdown_to_json.dictify(reformatted_md_text)

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": 
             ''' 
             Highlight any important market trends about stocks in the DOW 30 index. 
             Summarize the output.
             '''
             },
            {"role": "user", "content": f"Research Report: {json_data}"}
        ],
        temperature=0,
    )

    market_commentary = response.choices[0].message.content

    # Remove line breaks, markdown symbols, and other common formatting
    cleaned_text = re.sub(r'\n+', ' ', market_commentary)            
    cleaned_text = re.sub(r'#+|\*+|[-•]', '', cleaned_text)  
    cleaned_text = re.sub(r'\d+\.', '', cleaned_text)   
    cleaned_text = re.sub(r'\s+', ' ', cleaned_text).strip()

    try:
        with MongoClient(uri) as client:
            database = client.get_database("FYP-Test-DB")
            doc = database.get_collection("MarketCommentary")
            doc.insert_one({
                "market_commentary": cleaned_text,
                "date": datetime.now()
            })

        return {"success": "Market commentary created successfully!"}
    except Exception as e:
        return {"error": str(e)}


if __name__ == "__main__":

    uvicorn.run("market_commentary_service:app", host='127.0.0.1', port=5003, reload=True)
