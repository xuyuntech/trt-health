#!/bin/bash

docker rm -f mongo || true
docker run -d --name mongo --network composer_default -p 27017:27017 mongo