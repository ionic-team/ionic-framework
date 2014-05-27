#!/bin/bash

ARG_DEFS=(
  "--version-name=(.*)"
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

  echo "#####################################"
  echo "## Updating ionic-demo...           #"
  echo "#####################################"

  cd $IONIC_DIR

  rm -rf $DEMO_DIR/$VERSION_NAME
  gulp demos --release --demo-version=$VERSION_NAME

  cd $DEMO_DIR

  CHANGES=$(git status --porcelain)

  # if no changes, don't commit
  if [[ "$CHANGES" == "" ]]; then
    echo "-- No changes detected in demos for $VERSION_NAME; demos not updated."
  else
    git add -A
    git commit -am "demos: update for $VERSION_NAME"
    git push -q origin gh-pages

    echo "-- Updated demos for $VERSION_NAME succesfully!"
  fi
}

source $(dirname $0)/../utils.inc
