## Running the python services:
If you are not using docker-compose, you can run the python services individually.

### Finance News Service:
```
cd finance_news
docker build -t finance-news-service .
docker run -p 5004:5004 --env-file ../.env finance-news-service
```

### Market Commentary Service:
```
cd market_commentary
docker build -t market-commentary-service .
docker run -p 5003:5003 --env-file ../.env market-commentary-service
```

### Report Generator Service:
```
cd report_generator
docker build -t report-generator-service .
docker run -p 5002:5002 --env-file ../.env report-generator-service
```

### Stock Service:
```
cd stock_service
docker build -t stock-service .
docker run -p 5001:5001 --env-file ../.env stock-service
```

## Steps to start the python workflow:
1. Edit the .env file with the required environment variables according to the .env-example
2. Run the stock data service to populate the database with stock data
3. Start the other python services
4. The frontend will connect to the python services and call them accordingly

## To read the docs for the python services
1. Run the services
2. Open the docs in a browser using the following links
* Stock service: http://localhost:5001/docs
* Report Generator service: http://localhost:5002/docs
* Market Commentary service: http://localhost:5003/docs
* Finance News service: http://localhost:5004/docs
