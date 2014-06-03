#!/bin/bash

function init {
  RELEASE_DIR=$HOME/ionic-release
  ../clone/clone.sh --repository="driftyco/ionic" \
    --directory="$RELEASE_DIR" \
    --branch="master"
}

echo "##### "
echo "##### release/publish.sh"
echo "#####"

function run {
  cd ../..

  # These were bumped in the bump task
  cp CHANGELOG.md $RELEASE_DIR
  cp package.json $RELEASE_DIR

  node_modules/.bin/gulp build --release --dist=$RELEASE_DIR

  cd $RELEASE_DIR

  VERSION=$(readJsonProp "package.json" "version")
  CODENAME=$(readJsonProp "package.json" "codename")

  replaceJsonProp "bower.json" "version" "$VERSION"
  replaceJsonProp "component.json" "version" "$VERSION"

  replaceJsonProp "bower.json" "codename" "$CODENAME"
  replaceJsonProp "component.json" "codename" "$CODENAME"

  git add -A
  git commit -am "release: v$VERSION \"$CODENAME\""
  git tag -f -m v$VERSION v$VERSION

  git push -q origin master
  git push -q origin v$VERSION

  echo "-- Published ionic v$VERSION \"$CODENAME\" successfully!"
}

source $(dirname $0)/../utils.inc
