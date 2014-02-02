#!/bin/bash

# Adapted from Angular's bump script

echo "#########################################################"
echo "## Increment version, add suffix, and set version name ##"
echo "#########################################################"

ARG_DEFS=(
  "--version-type=(patch|minor|major)"
  "--version-name=(.+)"
  "--version-suffix=(.+)"
)

function run {
  cd ../..

  grunt bump:$VERSION_TYPE
  replaceJsonProp "package.json" "version" "(.*)" "\2-"$VERSION_SUFFIX
  replaceJsonProp "package.json" "codename" ".*" "$VERSION_NAME"

  VERSION=$(readJsonProp "package.json" "version")

  git add package.json
  git commit -m "chore(release): start v$VERSION"

  git push origin master
}

source $(dirname $0)/../utils.inc
