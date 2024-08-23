import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from gpt_researcher import GPTResearcher
import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel
import json
import markdown_to_json 

load_dotenv(dotenv_path="../.env")
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")
os.environ["TAVILY_API_KEY"] = os.getenv("TAVILY_API_KEY")

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

class Query(BaseModel):
    query: str

async def researcher_response(query):
    researcher = GPTResearcher(query=query, report_type="research_report")
    research_result = await researcher.conduct_research()
    research_report = await researcher.write_report()
    # print(research_report)

    with open("research_report.txt", "w") as file:
        file.write(research_report)

    lines = research_report.split("\n")
    reformatted_md_text = ""
    for line in lines:
        if not line.startswith("# "):
            reformatted_md_text += line + "\n"

    json_data = markdown_to_json.dictify(reformatted_md_text)
    json_data = json.dumps(json_data, indent=2)
    json_obj = json.loads(json_data)
    return json_obj

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/")
async def retrieve_finance_news(query: Query):
    prompt = query.query
    response = await researcher_response(prompt)
    return response

# @app.post("/")
# async def retrieve_json(query: Query):
#     prompt = query.query 
#     with open ("research_report.json", "r") as file:
#         response = file.read()
#         print(type(response))
#         json_obj = json.loads(response)
#         return json_obj

if __name__ == "__main__":
    uvicorn.run("finance_news:app", host='127.0.0.1', port=5000, reload=True)