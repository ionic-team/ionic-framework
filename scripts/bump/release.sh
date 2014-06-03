#!/bin/bash

ARG_DEFS=(
  "--new-version=(.*)"
)

echo "##### "
echo "##### bump/release.sh"
echo "#####"

function run {
  cd ../..

  CODENAME=$(cat config/CODENAMES | head -n 1)
  echo "$(tail -n +2 config/CODENAMES)" > config/CODENAMES

  replaceJsonProp "package.json" "codename" "$CODENAME"
  replaceJsonProp "package.json" "version" "$NEW_VERSION"

  node_modules/.bin/gulp changelog

  echo "-- New Version: $NEW_VERSION"
  echo "-- New Codename: $CODENAME"
}

source $(dirname $0)/../utils.inc
