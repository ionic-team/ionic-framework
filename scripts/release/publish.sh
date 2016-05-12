#!/bin/bash

function init {
  RELEASE_DIR=$HOME/ionic-release
  ../clone/clone.sh --repository="ionic" \
    --directory="$RELEASE_DIR" \
    --branch="master"
}

echo "##### "
echo "##### release/publish.sh"
echo "#####"

function run {
  cd ../..

  node_modules/.bin/gulp build --release --dist="$RELEASE_DIR/release"
  #node_modules/.bin/gulp changelog --dest="$RELEASE_DIR/CHANGELOG.md"

  # Move modified files into the repo copy we're going to push
  cp package.json $RELEASE_DIR

  cd $RELEASE_DIR

  echo "$(tail -n +2 config/CODENAMES)" > config/CODENAMES

  VERSION=$(readJsonProp "package.json" "version")
  CODENAME=$(readJsonProp "package.json" "codename")

  replaceJsonProp "bower.json" "version" "$VERSION"
  replaceJsonProp "component.json" "version" "$VERSION"

  replaceJsonProp "bower.json" "codename" "$CODENAME"
  replaceJsonProp "component.json" "codename" "$CODENAME"

  git config --global user.email "hi@ionicframework.com"
  git config --global user.name "Ionitron"

  git add -A
  git commit -am "release: v$VERSION \"$CODENAME\""
  git tag -f v$VERSION

  git push -q origin master
  git push -q origin v$VERSION

  echo "-- Published ionic v$VERSION \"$CODENAME\" successfully!"
}

source $(dirname $0)/../utils.inc
