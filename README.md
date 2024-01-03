# Run

`run.sh`

```
NODE_ENV=development \
API_DB_HOST=x.x.x.x \
API_DB_PORT=5432 \
API_DB_NAME=dbname \
API_DB_USER=username \
API_DB_PASSWORD=password \
API_DB_POOL_MIN=0 \
API_DB_POOL_MAX=10 \
API_SECRET_KEY=xxxxxx \
API_PORT=3000 \
npm start
```

`run.bat`

```bat
@ECHO OFF

SET NODE_ENV=development
SET API_DB_HOST=x.x.x.x
SET API_DB_PORT=5432
SET API_DB_NAME=dbname
SET API_DB_USER=username
SET API_DB_PASSWORD=password
SET API_DB_POOL_MIN=0
SET API_DB_POOL_MAX=10
SET API_SECRET_KEY=xxxxxx
SET API_PORT=3000
npm start
```

# Build

```
npm run build
```
