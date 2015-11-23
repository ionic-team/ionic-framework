#!/bin/bash

ARG_DEFS=(
  "--version-name=(.*)"
)

echo "##### "
echo "##### docs/deploy.sh"
echo "#####"

function init {
  cd ..
  SITE_PATH=$(readJsonProp "config.json" "sitePath")
  SITE_DIR=$IONIC_DIR/$SITE_PATH
}

function run {
  ./git/clone.sh --repository="driftyco/ionic-site" \
    --directory="$SITE_DIR" \
    --branch="master"
  cd ..
  VERSION=$(readJsonProp "package.json" "version")

  gulp docs --doc-version="$VERSION_NAME"
  gulp src
  cd $SITE_DIR

  CHANGES=$(git status --porcelain)

  # if no changes, don't commit
  if [[ "$CHANGES" == "" ]]; then
    ls
    echo "-- No changes detected in docs for $VERSION_NAME; docs not updated."
  else
    git add -A
    git commit -am "docs: update for $VERSION"
    git push origin master

    echo "-- Updated docs for $VERSION_NAME succesfully!"
  fi

}

source $(dirname $0)/../utils.sh.inc
