#!/bin/bash

TESTS_PATH=$1
FILE_EXTENSION=$2
CURRENT_SHARD=$3
TOTAL_SHARDS=$4

node_modules/.bin/concurrently "serve -s build -l 3000" "node_modules/.bin/wait-on http-get://localhost:3000 && npm run cypress -- --spec $(./scripts/shard.sh ${TESTS_PATH} ${FILE_EXTENSION} ${CURRENT_SHARD} ${TOTAL_SHARDS})"  --kill-others --success first
