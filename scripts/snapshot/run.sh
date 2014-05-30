#!/bin/bash

function init {
  # Set variables if they aren't, for local testing
  if [[ "$SNAPSHOT_BROWSER" == "" ]]; then
    export SNAPSHOT_BROWSER=chrome
    export SNAPSHOT_BROWSER_ID=chrome_desktop_test
    export SNAPSHOT_WIDTH=400
    export SNAPSHOT_HEIGHT=800
    export SNAPSHOT_TEST_ID=$RANDOM
    export SAUCE_TUNNEL_ID=$RANDOM
    export SAUCE_BUILD_ID=$RANDOM
  else
    export SNAPSHOT_TEST_ID=$CIRCLE_SHA1
    export SAUCE_TUNNEL_ID=$CIRCLE_BUILD_NUM
    export SAUCE_BUILD_ID=$CIRCLE_SHA1
  fi
}

function run {
  cd ../..
  gulp demos --demo-version=nightly

  gulp snapshot-sauce \
    --browser "$SNAPSHOT_BROWSER" \
    --params.platform_id="$SNAPSHOT_BROWSER_ID" \
    --params.width="$SNAPSHOT_WIDTH" \
    --params.height="$SNAPSHOT_HEIGHT" \
    --params.test_id="$SNAPSHOT_TEST_ID"
}

source $(dirname $0)/../utils.inc
