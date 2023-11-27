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
# automatically added in package.json
```

# Start serverless-offline locally

```bash
$ npx sls offline
```

## Through nodemon

```bash
$ nodemon --ignore ./s3-local --exec sls offline # already set as npm run dev
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

## Identical data but different `instanceof` exceptions

This can be proofed by the following code:

```js
const { GetObjectCommand, NoSuchBucket } = require("@aws-sdk/client-s3");
const { s3Client } = require("./s3Client");

module.exports.handler = async (/*...*/) => {
  try {
    const getObjectCommandOutput = await s3Client.send(
      new GetObjectCommand({
        /*...*/
      }),
    );
  } catch (error) {
    if (error instanceof NoSuchBucket) {
      return {
        /*...*/
      };
    }
    // reached
    throw new Error("Unidentified error");
  }
};
```

We expect an error to be caught by the second `if` statement, but it's not.

Both commands: `ListObjectsV2Command` & `GetObjectCommand` return an exception with the same data, which is observable `console.log`ging both error values. Both commands seems to return `NoSuchBucket` if the bucket does not exists. However, they differ as we evaluate them with the `instanceof` operator. Instead, we should use `S3ServiceException`:

```js
const { GetObjectCommand, S3ServiceException } = require("@aws-sdk/client-s3");
const { s3Client } = require("./s3Client");

module.exports.handler = async (/*...*/) => {
  try {
    const getObjectCommandOutput = await s3Client.send(
      new GetObjectCommand({
        /*...*/
      }),
    );
  } catch (error) {
    if (error instanceof S3ServiceException) {
      return {
        /*...*/
      };
    }
    // never reached
    throw new Error("Unidentified error");
  }
};
```

A possible alternative is to use `error.Code`, which unifies the error handling logic:

```js
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("./s3Client");

module.exports.handler = async (/*...*/) => {
  try {
    const getObjectCommandOutput = await s3Client.send(
      new GetObjectCommand({
        /*...*/
      }),
    );
  } catch (error) {
    if (error.Code === "NoSuchBucket") {
      return {
        /*...*/
      };
    }
    // never reached
    throw new Error("Unidentified error");
  }
};
```

## SQS `AggregateError`

```bash
Warning: AggregateError
    at internalConnectMultiple (node:net:1114:18)
    at afterConnectMultiple (node:net:1667:5)

Error:
AggregateError
    at internalConnectMultiple (node:net:1114:18)
    at afterConnectMultiple (node:net:1667:5) {
  code: 'NetworkingError',
  message: null,
  region: 'us-east-1',
  hostname: 'localhost',
  retryable: true,
  time: 2023-11-17T18:19:20.373Z,
  [errors]: [
    Error: connect ECONNREFUSED ::1:9324
        at createConnectionError (node:net:1634:14)
        at afterConnectMultiple (node:net:1664:40) {
      errno: -4078,
      code: 'ECONNREFUSED',
      syscall: 'connect',
      address: '::1',
      port: 9324
    },
    Error: connect ECONNREFUSED 127.0.0.1:9324
        at createConnectionError (node:net:1634:14)
        at afterConnectMultiple (node:net:1664:40) {
      errno: -4078,
      code: 'ECONNREFUSED',
      syscall: 'connect',
      address: '127.0.0.1',
      port: 9324
    }
  ]
}
```

Instead of declaring the AWS access key and secret in the serverless.yml, we use the default AWS profile for development and deployment to hide our keys. Use ElasticMQ, an in-memory message queue system, with serverless-offline-sqs plugin to simulate the local AWS SQS environment. This can be done docker-composing the ElasticMQ service.

## SQS `InvalidClientTokenId: The security token included in the request is invalid.`

```js
// Problematic code
import { SQSClient } from "@aws-sdk/client-sqs";

export default new SQSClient({
  forcePathStyle: true,
});
```

```js
// Solution
import { SQSClient } from "@aws-sdk/client-sqs";

export default new SQSClient({
  endpoint: "us-east-1", // add a region
  forcePathStyle: true,
});
```

## Docker Desktop + WSL's `sudo service docker start`

`make` may fail with the following error:

```bash
$ make
sudo service docker start
 * Starting Docker: docker
make: *** [makefile:6: start] Error 1
```

Fix this by stopping Docker Desktop and running `make stop` & `make` again.

## Messages being indefinitely enqueued back into SQS instead of DLQ

```bash
# Problematic command
$ sls offline # certain services are not triggered when using the command without `start`
```

```bash
# Solution
$ sls offline start
```

# Dockerized Postgres

```bash
$ docker compose --env-file .env.development.local up -d
$ docker compose --env-file .env.development.local config # see resolved env variables
$ docker exec -ti containerId bash
$ psql -U root serverless-node-api
$ psql \l
$ \q
```

## Docker cool commands

```bash
$ docker ps --format 'table {{.Names}}\t{{.Ports}}\t{{.Status}}'
```
