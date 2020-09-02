# NOTES

- possible libraries for controlling the daemons

  - detailed access control required: https://www.rabbitmq.com/rabbitmqctl.8.html#Access_Control
  - https://github.com/elasticio/amqp-rpc
  - implement an HTTP API to define which users can read / post to which Rabb.it message queue's
    - https://github.com/rabbitmq/rabbitmq-auth-backend-http

- refactor docker container control to use https://www.npmjs.com/package/node-docker-api
