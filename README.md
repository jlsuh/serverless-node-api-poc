# Install serverless as global package

```bash
$ npm install -g serverless
```

# Start a new serverless project

```bash
$ sls
```

# Test functions locally

```bash
$ sls invoke local -f api
```

# Install plugins

```bash
$ sls plugin install -n serverless-offline serverless-dotenv-plugin
$ npm i --save-dev serverless-offline serverless-dotenv-plugin
```

# Start serverless-offline locally

```bash
$ sls offline
```

## Through nodemon

```bash
$ nodemon --exec sls offline # already set as npm start
```
