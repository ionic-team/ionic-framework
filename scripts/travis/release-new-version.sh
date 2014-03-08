#!/bin/bash

echo "##############################"
echo "# Pushing release to $RELEASE_REMOTE #"
echo "##############################"

# Inspired by AngularJS's finalize-version script
# Run by travis when it detects a commit that changes package.json version

ARG_DEFS=(
  "--codename=(.*)"
  "--version=(.*)"
)

function run {
  cd ../..

  CODENAME=$(readJsonProp "package.json" "codename")

  replaceJsonProp "bower.json" "version" "$VERSION"
  replaceJsonProp "component.json" "version" "$VERSION"

  replaceJsonProp "bower.json" "codename" "$CODENAME"
  replaceJsonProp "component.json" "codename" "$CODENAME"

  echo "-- Putting built files into release folder"
  mkdir -p release
  cp -Rf dist/* release

  git add -A
  git commit -m "finalize-release: v$VERSION \"$CODENAME\""
  git tag -f -m "v$VERSION" v$VERSION

  git push -q $RELEASE_REMOTE master
  git push -q $RELEASE_REMOTE v$VERSION

  echo "-- v$VERSION \"$CODENAME\" pushed to $RELEASE_REMOTE/master successfully!"
}

source $(dirname $0)/../utils.inc
