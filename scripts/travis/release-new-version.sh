#!/bin/bash

# Inspired by AngularJS's finalize-version script
# Run by travis when it detects a commit that changes package.json version

ARG_DEFS=(
  "[--remote=(.*)]"
  "--codename=(.*)"
  "--version=(.*)"
)

function init {
  cd ../..

  REMOTE=$REMOTE || "origin"
  CODENAME=$(readJsonProp "package.json" "codename")

  replaceJsonProp "bower.json" "version" "$VERSION"
  replaceJsonProp "component.json" "version" "$VERSION"

  replaceJsonProp "bower.json" "codename" "$CODENAME"
  replaceJsonProp "component.json" "codename" "$CODENAME"

  echo "-- Putting built files into release folder"
  mkdir -p release
  cp -Rf dist/* release

  git add -A
  git commit -m "release: v$VERSION \"$CODENAME\""
  git tag -f -m "v$VERSION" v$VERSION

  git push $REMOTE master
  git push -q $REMOTE v$VERSION

  echo "-- v$VERSION \"$CODENAME\" pushed to ionic#master successfully!"
}

source $(dirname $0)/../utils.inc
