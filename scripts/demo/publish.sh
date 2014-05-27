#!/bin/bash

ARG_DEFS=(
  "--version=(.*)"
)

function init {
  DEMO_DIR=$IONIC_DIST_DIR/ionic-demo

  echo "-- Cloning ionic-demo"
  rm -rf $DEMO_DIR
  mkdir -p $DEMO_DIR
  git clone https://driftyco:$GH_TOKEN@github.com/driftyco/ionic-demo \
    $DEMO_DIR \
    --depth=1 \
    --branch=gh-pages
}

function run {
  cd $IONIC_DIR

  rm -rf $DEMO_DIR/$VERSION
  gulp demos --release --demo-version=$VERSION

  cd $DEMO_DIR

  CHANGES=$(git status --porcelain)

  # if no changes, don't commit
  if [[ "$CHANGES" == "" ]]; then
    echo "-- No changes detected in demos for $VERSION; demos not updated."
  else
    git add -A
    git commit -am "demos: update for $VERSION"
    git push -q origin gh-pages

    echo "-- Updated demos for $VERSION succesfully!"
  fi
}

source $(dirname $0)/../utils.inc
