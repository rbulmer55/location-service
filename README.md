# Location Microservice

## Building

Using Esbuild `./build.js` we can target our application entry points - compile our typescript functions and use these for our terraform deployment to AWS Lambda.

Build scripts:

1. Build
2. Plan
3. Deploy

```
    "build": "rm -rf dist && node build.js",

    "preplan": "npm run build",

    "plan": "dotenv -e .env -- bash -c 'cd ./terraform/env/$(echo $TF_VAR_ENVIRONMENT | tr \"[:upper:]\" \"[:lower:]\") && terraform init --upgrade=true && terraform plan'",

    "predeploy": "dotenv -e .env -- bash -c 'npm run planDot'",

    "deploy": "dotenv -e .env -- bash -c 'cd ./terraform/env/$(echo $TF_VAR_ENVIRONMENT | tr \"[:upper:]\" \"[:lower:]\") && terraform apply -auto-approve'"
```

## Infra

A MongoDB Atlas cluster is created in terraform with a private endpoint serivce.

We create a private VPC in AWS and a private endpoint to link to Atlas.

Lambda functions are fronted by an API Gateway. Lambda functions have permissions to read the DB connection secret (can be changed to IAM Role) in AWS Secrets Manager to connect to the Database with the NodeJs MongoDB driver.
