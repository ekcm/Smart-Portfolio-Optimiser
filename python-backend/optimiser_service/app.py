import requests
import pandas as pd
import os
from dotenv import load_dotenv
from pypfopt.expected_returns import mean_historical_return
from pypfopt.risk_models import CovarianceShrinkage
from pypfopt.efficient_frontier import EfficientFrontier
from flask import Flask, jsonify, request
from collections import OrderedDict
from pymongo import MongoClient

app = Flask(__name__)
load_dotenv()
DB_URI = os.getenv('DB_URI')
DB_NAME = os.getenv('DB_NAME')
client = MongoClient(DB_URI)
db = client[DB_NAME]
collection = db['AssetPrice']

@app.route('/optimiser', methods=['GET'])
def optimise():
    """
    Optimise portfolio excluding specific tickers.
    ---
    parameters:
      - name: exclusions[]
        in: query
        type: array
        items:
          type: string
        required: false
        description: List of tickers to exclude from the optimisation.
    responses:
      200:
        description: Optimised weights for the portfolio.
        schema:
          type: object
          additionalProperties:
            type: number
    """
    
    exclusions = request.args.getlist('exclusions[]')
    query = {'ticker': {"$nin": exclusions}}
    results = list(collection.find(query, {"ticker": 1, "date": 1, "todayClose": 1, "_id": 0}))

    pivot_df = pd.DataFrame(results)

    pivot_df.index = pd.to_datetime(pivot_df.index)
    pivot_df = pivot_df.sort_index()

    mu = mean_historical_return(pivot_df)
    S = CovarianceShrinkage(pivot_df).ledoit_wolf()

    ef = EfficientFrontier(mu, S)
    weights = ef.max_sharpe(risk_free_rate=0)

    cleaned_weights = ef.clean_weights()

    response = OrderedDict((k, v) for k, v in cleaned_weights.items() if v != 0)

    return jsonify(response)

@app.route('/optimiser/include')
def optimise_portfolio():
    """
    Optimise portfolio including specific tickers.
    ---
    parameters:
      - name: inclusions[]
        in: query
        type: array
        items:
          type: string
        required: true
        description: List of tickers to include in the optimisation.
    responses:
      200:
        description: Optimised weights for the portfolio.
        schema:
          type: object
          additionalProperties:
            type: number
    """
    try:
      inclusions = request.args.getlist('inclusions[]')
      query = {'ticker': {"$in": inclusions}}
      results = list(collection.find(query, {"ticker": 1, "date": 1, "todayClose": 1, "_id": 0}))

      pivot_df = pd.DataFrame(results)

      pivot_df.index = pd.to_datetime(pivot_df.index)
      pivot_df = pivot_df.sort_index()

      mu = mean_historical_return(pivot_df)
      S = CovarianceShrinkage(pivot_df).ledoit_wolf()

      ef = EfficientFrontier(mu, S)
      weights = ef.max_sharpe(risk_free_rate=0)

      cleaned_weights = ef.clean_weights()

      response = OrderedDict((k, v) for k, v in cleaned_weights.items() if v != 0)

      return jsonify(response), 200
    
    except Exception as e:
      return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6969)