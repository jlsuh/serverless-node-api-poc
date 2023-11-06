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
$ npx sls invoke local -f path/to/function
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

# Start serverless with specific stage environment variables

```bash
# useDotenv must be set as true
$ npx sls offline # defaults to "development"
$ npx sls offline --stage production # matches with .env.production
# .env, .env.development, and .env.production files should be included in out repository as they define defaults.
# .env.*.local files should be added to .gitignore, as those files are intended to be ignored. .env.local is where secrets can be stored.

# DOTENV: Loading environment variables from .env, .env.development, .env.development.local
# serverless-dotenv-plugin loads by priority: .env > .env.development > .env.development.local
# each of repeating variables are not overwritten by the next .env file
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

## `[504] - Lambda timeout.`

```js
// Problematic code
module.exports.handler = (event, context, callback) => {
  //...
};
```

```js
// Solution
module.exports.handler = async (event, context, callback) => {
  //...
};
```

## Server responding `502 Bad Gateway` on every single request (although error handling logic seems to be correct)

### Cause 1

Missing try-catch block.

```js
// Problematic code
module.exports.handler = async (event, _, callback) => {
  const { body } = JSON.parse(event.body);
  if (!body) {
    throw new Error("Body can't be empty");
  }
  // further logic
};
```

```js
// Solution
module.exports.handler = async (event, _, callback) => {
  const { body } = JSON.parse(event.body);
  try {
    if (!body) {
      throw new Error("Body can't be empty");
    }
    // further logic
  } catch (err) {
    return {
      // response body with error message
    };
  }
};
```

### Cause 2

Missing `async/await` pairs.

```js
// Problematic code
module.exports.handler = async (/*...*/) => {
  try {
    anAsyncFunction(/*...*/).then(/*...*/).catch(/*...*/);
  } catch (err) {
    return {
      // response body with error message
    };
  }
};

const anAsyncFunction = (/*...*/) => {
  //...
};
```

```js
// Solution
module.exports.handler = async (/*...*/) => {
  try {
    await anAsyncFunction(/*...*/).then(/*...*/).catch(/*...*/);
  } catch (err) {
    return {
      // response body with error message
    };
  }
};

const anAsyncFunction = async (/*...*/) => {
  //...
};
```
