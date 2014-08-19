#!/bin/bash

ARG_DEFS=(
  "--new-version=(.*)"
)

echo "##### "
echo "##### bump/release.sh"
echo "#####"

function run {
  cd ../..

  CODENAME=$(head -n 1 config/CODENAMES)

  replaceJsonProp "package.json" "codename" "$CODENAME"
  replaceJsonProp "package.json" "version" "$NEW_VERSION"

  echo "-- New Version: $NEW_VERSION"
  echo "-- New Codename: $CODENAME"
}

source $(dirname $0)/../utils.inc
