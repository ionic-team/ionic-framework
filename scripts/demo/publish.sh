#!/bin/bash

ARG_DEFS=(
  "--version-name=(.*)"
)

echo "##### "
echo "##### demo/publish.sh"
echo "#####"

function init {
  DEMO_DIR=$HOME/ionic-demo

  ../clone/clone.sh --repository="ionic-demo" \
    --depth="1" \
    --directory="$DEMO_DIR" \
    --branch="gh-pages"
}

function run {
  cd ../..

  rm -rf $DEMO_DIR/$VERSION_NAME
  node_modules/.bin/gulp demos --release --demo-version=$VERSION_NAME --dist=$DEMO_DIR

  cd $DEMO_DIR

  CHANGES=$(git status --porcelain)

  # if no changes, don't commit
  if [[ "$CHANGES" == "" ]]; then
    echo "-- No changes detected in demos for $VERSION_NAME; demos not updated."
  else
    git add -A
    git commit -am "demos: update for $VERSION_NAME"
    git push -q origin gh-pages

    echo "-- Demos published $VERSION_NAME succesfully!"
  fi
}

source $(dirname $0)/../utils.inc
