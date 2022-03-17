#!/bin/bash

CURRENT_SHARD=$1
TOTAL_SHARDS=$2

node_modules/.bin/concurrently "npm run start -- --mode production" "node_modules/.bin/wait-on http-get://localhost:8080 && npm run cypress -- --spec $(./scripts/shard.sh ${CURRENT_SHARD} ${TOTAL_SHARDS})"  --kill-others --success first
