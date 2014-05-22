#!/bin/bash

ARG_DEFS=(
  "--version=(.*)"
  "[--old-version=(.*)]"
)

function init {
  PUSH_DIR=$IONIC_DIST_DIR/ionic

  echo "-- Cloning ionic master ..."

  rm -rf $PUSH_DIR
  mkdir -p $PUSH_DIR
  git clone https://driftyco:$GH_TOKEN@github.com/driftyco/ionic.git \
    $PUSH_DIR \
    --depth=1
}

function run {

  echo "##############################"
  echo "# Pushing release $VERSION   #"
  echo "##############################"

  cd $PUSH_DIR

  # Get first codename in list
  CODENAME=$(readJsonProp "$IONIC_DIR/package.json" "codename")

  replaceJsonProp "package.json" "version" "$VERSION"
  replaceJsonProp "bower.json" "version" "$VERSION"
  replaceJsonProp "component.json" "version" "$VERSION"

  echo "-- Putting built files into release folder"

  rm -rf release
  mkdir -p release
  cp -Rf $IONIC_BUILD_DIR/* release

  git add -A
  git commit -m "finalize-release: v$VERSION \"$CODENAME\""
  git tag -f -m "v$VERSION" v$VERSION

  git push -q origin master
  git push -q origin v$VERSION

  echo "-- v$VERSION \"$CODENAME\" pushed to origin/master successfully!"
}

function tweetAndIrc {
  cd $IONIC_DIR
  gulp release-tweet release-irc
}

source $(dirname $0)/../utils.inc
