# Run

`run.sh`

```
NODE_ENV=development \
DB_HOST=x.x.x.x \
DB_PORT=3306 \
DB_NAME=dbname \
DB_USER=username \
DB_PASSWORD=password \
DB_POOL_MIN=0 \
DB_POOL_MAX=10 \
SECRET_KEY=xxxxxx \
PORT=3000 \
npm start
```

`run.bat`

```bat
@ECHO OFF

SET NODE_ENV=development
SET DB_HOST=x.x.x.x
SET DB_PORT=3306
SET DB_NAME=dbname
SET DB_USER=username
SET DB_PASSWORD=password
SET DB_POOL_MIN=0
SET DB_POOL_MAX=10
SET SECRET_KEY=xxxxxx
SET PORT=3000
npm start
```

# Build

```
npm run build
```
