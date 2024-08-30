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
client = OpenAI()

class Query(BaseModel):
    query: str

async def researcher_response(query):
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

    with open("reports/research_report.txt", "w") as file:
        file.write(research_report)

    with open("reports/research_report.json", "w") as file:
        file.write(json_data)
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

@app.get("/keyword_extraction")
def keyword_extraction():
    '''
    This service is used to perform keyword_extraction on the research report.

    It reads the research report from the file, extracts the key words such as specific industries and companies mentioned in the report, and performs sentiment analysis on the extracted text.
    '''
    with open("reports/research_report.json", "r") as file:
        research_report = file.read()

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Your role is to extract industry keywords and stock tickers from the research report"},
            {"role": "user", "content": f'''
                ### Instruction ###
                Extract the industry keywords and stock tickers from the research report.
                Text: Advance Auto Parts (AAP) tumbled by 17.5% after its profit for the latest quarter fell short of Wall Street's expectations, citing a \"challenging demand environment\" and lowering its full-year profit forecast ([AP News](https://apnews.com/article/stock-markets-fed-inflation-earnings-japan-a829ed05df2841063ed5da6fb3767a98)).
            '''
            },
            {"role": "assistant", "content": "AAP"},
            {"role": "user", "content": f'''
                ### Instruction ###
                Extract the industry keywords and stock tickers from the research report.
                Text: Oil prices faced a weekly decline due to demand concerns and ongoing geopolitical tensions in Gaza. The market's focus remains on the potential impact of these factors on global oil supply and demand dynamics ([Bloomberg](https://www.bloomberg.com/news/articles/2024-08-22/latest-oil-market-news-and-analysis-for-aug-23)).
            '''
            },
            {"role": "assistant", "content": "Oil"},
            {"role": "user", "content": f'''
                ### Instruction ###
                Extract the industry keywords and stock tickers from the research report.
                Text: {research_report}.
            '''
            }
        ],
        temperature=0,
    )

    answer = response.choices[0].message.content
    json_obj = {}
    answer_list = answer.split("\n")
    current_header = ""
    for line in answer_list:
        if line.startswith("**"):
            current_header = line[2:-2]
            json_obj[current_header] = []
        else:
            if current_header == "":
                pass
            else:
                if line[2:] == "":
                    pass
                else:
                    json_obj[current_header].append(line[2:])
    json_str = json.dumps(json_obj, indent=2)
    with open("reports/keyword_extraction.json", "w") as file:
        file.write(json_str)
    return json_obj

@app.get("/sentiment_analysis")
def sentiment_analysis():
    '''
    This service is used to perform sentiment analysis on the research report.
    
    It retrieves the json object from keyword_extraction.json and the entire research text from research_report.txt.

    Using the json object, it performs sentiment analysis on the extracted text.
    '''

    # edit the keyword_extraction.json file
    with open("reports/keyword_extraction.json", "r") as file:
        keyword_extraction = file.read()
        keyword_extraction = json.loads(keyword_extraction)

    # edit the research_report.txt file
    with open("reports/research_report.txt", "r") as file:
        research_report = file.read()

    sentiment_analysis_list = []

    for k,v in keyword_extraction.items():
        for keyword in v:
    
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "Your role is to search for the sentence or paragraph that is relevant to the keyword."},
                    {"role": "user", "content": f'''
                        ### Instruction ###
                        Extract the sentence or paragraph that is relevant to the keyword.
                        Keywords: "{keyword}".
                        Text: {research_report}.
                    '''
                    }
                ],
                temperature=0,
            )
            keyword_sentence = response.choices[0].message.content

            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "Your role is to perform sentiment analysis on the extracted text."},
                    {"role": "user", "content": f'''
                        ### Instruction ###
                        Perform sentiment analysis on the extracted text. Return the output as Positive, Negative, or Neutral.
                        Text: {keyword_sentence}.
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
            return_json = {
                "keyword_extraction": keyword,
                "keyword_sentence": keyword_sentence,
                "sentiment_analysis": sentiment_analysis_classification,
                "date": datetime.now().date()
            }
            sentiment_analysis_list.append(return_json)

    return sentiment_analysis_list

# if this approach is better, we can use this instead of the other endpoints
@app.post("/orchestrate_sentiment_analysis")
async def orchestrate_sentiment_analysis():
    query = "Give financial news information for this week"
    await researcher_response(query)
    keyword_extraction()
    json_obj = sentiment_analysis()
    return json_obj

if __name__ == "__main__":
    uvicorn.run("finance_news:app", host='127.0.0.1', port=5000, reload=True)