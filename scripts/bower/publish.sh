#!/bin/bash

ARG_DEFS=(
)

echo "##### "
echo "##### bower/publish.sh"
echo "#####"

function init {
  BOWER_DIR=$HOME/ionic-bower

  ../clone/clone.sh --repository="ionic-bower" \
    --depth="1" \
    --directory="$BOWER_DIR" \
    --branch="master"
}

function run {
  cd ../..

  VERSION=$(readJsonProp "package.json" "version")
  CODENAME=$(readJsonProp "package.json" "codename")

  echo "-- Putting build files in ionic-bower..."
  node_modules/.bin/gulp build --release --dist=$BOWER_DIR
  cp -Rf scss $BOWER_DIR

  # Angular dependencies are managed by bower, don't include them
  # We also don't need a changelog or version.json
  rm -rf $BOWER_DIR/{js/angular*,CHANGELOG*,version.json}

  echo "-- Copying bower.json from project_dir and renaming main files"
  node -p "var b = require('./bower.json');
    delete b.ignore;
    b.main = b.main.map(function(s) {
      return s.replace(/^release\//,'');
    });
    JSON.stringify(b,null,2);" \
    > $BOWER_DIR/bower.json

  cd $BOWER_DIR

  echo "-- Updating version in ionic-bower to $VERSION"
  replaceJsonProp "bower.json" "version" "$VERSION"

  echo "-- Updating codename in ionic-bower to $CODENAME"
  replaceJsonProp "bower.json" "codename" "$CODENAME"
  
  git config --global user.email "hi@ionicframework.com"
  git config --global user.name "Ionitron"

  git add -A
  git commit -am "release: v$VERSION"
  git tag -f -m v$VERSION v$VERSION

  git push -q --tags origin master

  echo "-- Published ionic-bower v$VERSION successfully!"
}

source $(dirname $0)/../utils.inc
