# Installation

Run the provided script ``initialize.sh`` to install all required dependencies.

You will need to install v8 manually in the 3rdparty folder to enable javascript lambdas. See: http://commondatastorage.googleapis.com/chrome-infra-docs/flat/depot_tools/docs/html/depot_tools_tutorial.html#_setting_up 

# notes

## emulating execution environment
https://docs.aws.amazon.com/lambda/latest/dg/current-supported-versions.html

## supported runtimes
```
Valid Values: nodejs | nodejs4.3 | nodejs6.10 | nodejs8.10 | java8 | python2.7 | python3.6 | dotnetcore1.0 | dotnetcore2.0 | dotnetcore2.1 | nodejs4.3-edge | go1.x
```

## examples of various requests (logged via an http echo server)

### create_function

the request 'create_function' looks something like
```
----- Request Start ----->
/2015-03-31/functions
Host: localhost:8080
Accept-Encoding: identity
Content-Length: 507
User-Agent: aws-cli/1.15.75 Python/2.7.15 Darwin/17.6.0 botocore/1.10.74

{"Code": {"ZipFile": "UEsDBBQAAAAIALEBC03q6vuFYwAAAJkAAAAHABwAbWFpbi5weVVUCQADbmJuW3Fiblt1eAsAAQQAAAAABAAAAAB1jDEKgDAQBGt9xXKVQckDBF8iKaI5Jc0p8RSfb9BCLOx2mdkNPMGHUPHBog3GRZRPNW1ZrCmKVnQDxA188rhrlNlaS+bLe+9Q44mDQwfKddP03Pbk6eU0kDN5n1j3JPgxygtQSwECHgMUAAAACACxAQtN6ur7hWMAAACZAAAABwAYAAAAAAABAAAApIEAAAAAbWFpbi5weVVUBQADbmJuW3V4CwABBAAAAAAEAAAAAFBLBQYAAAAAAQABAE0AAACkAAAAAAA="}, "Handler": "main.add", "Role": "arn:aws:iam::239831239174:role/basic_lambda_role", "FunctionName": "add", "Runtime": "python2.7"}
<----- Request End -----
```
when ripped from an HTTP server

```
aws lambda create-function \
    --function-name add \
    --zip-file fileb://main.zip\
    --role arn:aws:iam::239831239174:role/basic_lambda_role \
    --handler main.add \
    --runtime python2.7 \
    --no-sign-request \
    --endpoint-url http://localhost:80 \
    --no-verify-ssl 
```
