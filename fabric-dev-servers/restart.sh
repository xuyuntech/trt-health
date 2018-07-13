#!/bin/bash
docker rm -f mongo || true
./stopFabric.sh
./teardownFabric.sh
./startFabric.sh