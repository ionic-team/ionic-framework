#!/bin/bash

# Adapted from Angular's bump script

echo "#########################################################"
echo "## Increment version, add suffix, and set version name ##"
echo "#########################################################"

# force user to define git-push-dryrun so he has to think!
ARG_DEFS=(
  "--git-push-dryrun=(true|false)"
  "--version-type=(patch|minor|major)"
  "--version-name=(.+)"
  "--version-suffix=(.+)"
)

function run {
  cd ../..

  grunt bump:$VERSION_TYPE
  VERSION=$(readJsonProp "package.json" "version")

  replaceJsonProp "package.json" "version" "$VERSION-$VERSION_SUFFIX"
  replaceJsonProp "package.json" "codename" "$VERSION_NAME"

  VERSION=$(readJsonProp "package.json" "version")

  git add package.json
  git commit -m "chore(post-release): start v$VERSION"

  git push origin master

  echo "Version initialized & published as v$VERSION successfully!"
}

source $(dirname $0)/../utils.inc
