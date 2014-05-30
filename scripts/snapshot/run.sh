#!/bin/bash

ARG_DEFS=(
  "--browser=(.*)"
  "[--platform=(.*)]"
  "--platform-id=(.*)"
  "--width=(.*)"
  "--height=(.*)"
)

function run {
  cd ../..
  gulp demos --demo-version=nightly

  gulp snapshot-sauce \
    --browser "$BROWSER" \
    --platform "$PLATFORM" \
    --params.platform_id="$PLATFORM_ID" \
    --params.width="$WIDTH" \
    --params.height="$HEIGHT" \
    --params.test_id="$($CIRCLE_SHA1 || $RANDOM)"
}

source $(dirname $0)/../utils.inc
