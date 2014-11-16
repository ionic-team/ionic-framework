#!/bin/bash

ARG_DEFS=(
)

echo "##### "
echo "##### app-base/publish.sh"
echo "#####"

function init {
  APPBASE_DIR=$HOME/ionic-app-base
  APPBASE_LIB_DIR=$APPBASE_DIR/www/lib/ionic

  ../clone/clone.sh --repository="driftyco/ionic-app-base" \
    --depth="1" \
    --directory="$APPBASE_DIR" \
    --branch="master"
}

function run {
  cd ../..

  VERSION=$(readJsonProp "package.json" "version")

  echo "-- Updating files..."

  rm -rf $APPBASE_LIB_DIR
  mkdir -p $APPBASE_LIB_DIR

  node_modules/.bin/gulp build --release --dist=$APPBASE_LIB_DIR
  cp -Rf scss $APPBASE_LIB_DIR

  echo "-- Updating bower dependency..."
  replaceJsonProp "$APPBASE_DIR/bower.json" "ionic" "driftyco\/ionic-bower#$VERSION"

  cd $APPBASE_DIR

  git add -A
  git commit -am "release: update ionic to v$VERSION"
  git push -q origin master

  echo "-- ionic-app-base published v$VERSION successfully!"
}

source $(dirname $0)/../utils.inc
