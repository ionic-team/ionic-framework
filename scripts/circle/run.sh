#!/bin/bash

function init {
  # Global Variables
  export SAUCE_TUNNEL_ID=$($CIRCLE_BUILD_NUM || $RANDOM)
  export SAUCE_BUILD_ID=$($CIRCLE_SHA1 || $RANDOM)
}

function run {
  case $CIRCLE_NODE_INDEX in
  0)
    ../snapshot/run.sh \
      --width="400" \
      --height="800" \
      --browser="chrome" \
      --platform-id="chrome_desktop_small"
    ;;
  1)
    ../snapshot/run.sh \
      --width="400" \
      --height="800" \
      --browser="safari" \
      --platform="OS X 10.9" \
      --platform-id="safari_desktop_small"
    ;;
  esac
}

source $(dirname $0)/../utils.inc
