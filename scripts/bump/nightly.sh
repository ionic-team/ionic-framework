#!/bin/bash

ARG_DEFS=(
  "--build-number=(.*)"
)

echo "##### "
echo "##### bump/nightly.sh"
echo "#####"

function run {
VERBOSE=true
  cd ../..

  OLD_VERSION=$(readJsonProp "package.json" "version")
  NIGHTLY_VERSION="$OLD_VERSION-nightly-$BUILD_NUMBER"

  replaceJsonProp "package.json" "version" "$NIGHTLY_VERSION"

  echo "-- Nightly Version: $NIGHTLY_VERSION"
}

source $(dirname $0)/../utils.inc
