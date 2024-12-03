### Running the python services:

#### Finance News Service:
```
docker build -t finance-news-service .
docker run -p 5004:5004 --env-file ../.env finance-news-service
```

#### Market Commentary Service:
```
docker build -t market-commentary-service .
docker run -p 5003:5003 --env-file ../.env market-commentary-service
```

#### Report Generator Service:
```
docker build -t report-generator-service .
docker run -p 5002:5002 --env-file ../.env report-generator-service
```

#### Stock Data Service:
```
docker build -t stock-data-service .
docker run -p 5001:5001 --env-file ../.env stock-data-service
```

### Steps to start the python workflow:
1. Edit the .env file with the required environment variables according to the .env-example
2. Run the stock data service to populate the database with stock data
3. Start the other python services
4. The frontend will connect to the python services and call them accordingly
