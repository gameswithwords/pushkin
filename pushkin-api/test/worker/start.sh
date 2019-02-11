#!/bin/bash
echo "miniexample db worker container loaded, waiting for rabbitmq"
while ! nc -z localhost 5672; do sleep 3; done
echo "Rabbitmq loaded"
node index.js
