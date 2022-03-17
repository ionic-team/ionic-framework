#!/bin/bash

TESTS_PATH=$1
CURRENT_SHARD=$2
TOTAL_SHARDS=$3

node_modules/.bin/concurrently "npm run start -- --mode production" "node_modules/.bin/wait-on http-get://localhost:8080 && npm run cypress -- --spec $(./scripts/shard.sh ${TESTS_PATH} ${CURRENT_SHARD} ${TOTAL_SHARDS})"  --kill-others --success first
