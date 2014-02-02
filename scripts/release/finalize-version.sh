#!/bin/bash

# Inspired by AngularJS's finalize-version script

ARG_DEFS=(
  "--action=(prepare|publish)"
)

function prepare {
  cd ../..

  # Remove suffix
  replaceJsonProp "package.json" "version" "(.*)?-[a-zA-Z]+" "\2"

  VERSION=$(readJsonProp "package.json" "version")
  CODENAME=$(readJsonProp "package.json" "codename")

  replaceJsonProp "bower.json" "version" ".*" "$VERSION"
  replaceJsonProp "component.json" "version" ".*" "$VERSION"

  git add package.json bower.json component.json
  git commit -m "chore(release): v$VERSION"
  git tag -m "v$VERSION" v$VERSION

  echo "--"
  echo "-- Version is now $VERSION, codename $CODENAME."
  echo "-- Release commit & tag created."
  echo "-- When ready to push, run ./scripts/finalize-version.sh --action=publish"
  echo "--"
}

function publish {
  cd ../..

  VERSION=$(readJsonProp "package.json" "version")
  BRANCH=$(git rev-parse --abbrev-ref HEAD)

  git push origin $BRANCH
  git push origin v$VERSION

  cd $SCRIPT_DIR
}

source $(dirname $0)/../utils.inc
