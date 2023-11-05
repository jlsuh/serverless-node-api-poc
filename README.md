# Install serverless as local package

```bash
$ npm install serverless # having it as global package is discouraged
# pnpm can be used as an alternative to enforce the exclusion of serverless in global scope
```

# Start a new serverless project

```bash
$ npx sls
```

# Test functions locally

```bash
$ npx sls invoke local -f api
```

# Install plugins

```bash
$ npx sls plugin install -n serverless-offline serverless-dotenv-plugin # ... append other plugins
$ npm i --save-dev serverless-offline serverless-dotenv-plugin # ... append other plugin dependencies
```

# Start serverless-offline locally

```bash
$ npx sls offline
```

## Through nodemon

```bash
$ nodemon --exec sls offline # already set as npm start
# for some strange reason nodemon reloads on client-triggered s3 commands (e.g., PutObjectCommand)
```

# Solutions to errors

## `Error: [504] - Lambda timeout.: Error while running handler`

```js
// Problematic code
module.exports.handler = (event, context, callback) => {
  console.log(JSON.stringify(event));
  console.log(JSON.stringify(context));
  console.log(JSON.stringify(process.env));
};
```

```js
// Solution
module.exports.handler = (event, context, callback) => {
  console.log(JSON.stringify(event));
  console.log(JSON.stringify(context));
  console.log(JSON.stringify(process.env));
  callback(null, "ok");
};
```
