import requests
import pandas as pd
import os
from dotenv import load_dotenv
from pypfopt.expected_returns import mean_historical_return
from pypfopt.risk_models import CovarianceShrinkage
from pypfopt.efficient_frontier import EfficientFrontier
from flask import Flask, jsonify
from collections import OrderedDict

app = Flask(__name__)
load_dotenv()
URL = os.getenv('ASSETPRICE_URI')

@app.route('/optimiser', methods=['GET'])
def optimise():
    # exclusions = request.args.getlist('exclusions')

    # params = {'tickers': exclusions}

    # response = requests.get(url, params = params)
    response = requests.get(URL)
    data = response.json()

    df = pd.DataFrame(data)

    pivot_df = df.pivot(index='date', columns = 'ticker', values='todayClose')

    pivot_df.index = pd.to_datetime(pivot_df.index)
    pivot_df = pivot_df.sort_index()

    mu = mean_historical_return(pivot_df)
    S = CovarianceShrinkage(pivot_df).ledoit_wolf()

    ef = EfficientFrontier(mu, S)
    weights = ef.max_sharpe()

    cleaned_weights = ef.clean_weights()

    response = OrderedDict((k, v) for k, v in cleaned_weights.items() if v != 0)

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True, port=6969)