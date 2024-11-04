import requests
import pymongo
import os
from dotenv import load_dotenv

load_dotenv()
uri = os.getenv("MONGO_URI")

def lambda_handler(event, context):
    print(f"Version of requests library: {requests.__version__}")
    request = requests.get('https://api.github.com/')
    return {
        'statusCode': 200,
        'body': f"Version of requests library: {requests.__version__}, MongoDB URI: {uri}"
    }

if __name__ == "__main__":
    print(lambda_handler(None, None))