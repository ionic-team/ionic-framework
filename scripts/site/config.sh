#!/bin/bash

ARG_DEFS=(
)

echo "##### "
echo "##### site/config.sh"
echo "#####"

function init {
  SITE_DIR=$HOME/ionic-site

  ../clone/clone.sh --repository="driftyco/ionic-site" \
    --directory="$SITE_DIR" \
    --branch="master"
}

function run {
  cd ../..

  VERSION=$(readJsonProp "package.json" "version")
  CODENAME=$(readJsonProp "package.json" "codename")
  DATE=$(date +"%Y-%m-%d")

  cd $SITE_DIR
  npm install

  $(replaceInFile "_config.yml" "latest_download:.*$" "latest_download: http:\/\/code.ionicframework.com\/$VERSION\/ionic-v$VERSION.zip")
  $(replaceInFile "_config.yml" "latest_version:.*$" "latest_version: $VERSION \"$CODENAME\"")
  $(replaceInFile "_config.yml" "latest_release_date:.*$" "latest_release_date: $DATE")

  git add -A
  git commit -am "release: $VERSION"
  source deploy.sh

  echo "-- Published ionic-site config v$VERSION successfully!"
}


source $(dirname $0)/../utils.inc
