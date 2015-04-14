#!/bin/bash

ARG_DEFS=(
  "--index=(.*)"
  "--total=(.*)"
)

function init {
  # Global Variables
  export SAUCE_TUNNEL_ID=${CIRCLE_BUILD_NUM:-$RANDOM}-$CIRCLE_NODE_INDEX
  export SAUCE_BUILD_ID=${CIRCLE_SHA1:-$RANDOM}
}

function run {
  cd ../..

  if [[ "$(git symbolic-ref --short HEAD)" == "master" ]]; then
    IS_MASTER=true
  fi

  node_modules/.bin/gulp demos --demo-version=nightly
  TEST_ID=$CIRCLE_SHA1-$CIRCLE_BUILD_NUM

  case $INDEX in
  0)
    [ -z $IS_MASTER ] || node_modules/.bin/gulp ddescribe-iit
    node_modules/.bin/gulp eslint
    node_modules/.bin/gulp karma --browsers=PhantomJS --reporters=dots
    ;;
  1)
    # node_modules/.bin/gulp snapshot-sauce \
    #   --browser="chrome" \
    #   --params.width="400" \
    #   --params.height="800" \
    #   --params.test_id=$TEST_ID
    #   --params.platform_id="chrome_desktop_small" \
    #   --params.platform_index=$INDEX \
    #   --params.platform_count=$TOTAL
    ;;
  2)
    # node_modules/.bin/gulp snapshot-sauce \
    #   --browser="safari" \
    #   --platform="OS X 10.9"
    #   --params.width="400" \
    #   --params.height="800" \
    #   --params.test_id=$TEST_ID \
    #   --params.platform_id="safari_desktop_small" \
    #   --params.platform_index=$INDEX \
    #   --params.platform_count=$TOTAL
    ;;
  3)
    ;;
  4)
    ;;
  5)
    ;;
  esac
}

source $(dirname $0)/../utils.inc
