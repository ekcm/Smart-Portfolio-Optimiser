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
