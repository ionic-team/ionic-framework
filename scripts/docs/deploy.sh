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

  ./git/clone.sh --repository="driftyco/ionic-site" \
    --directory="$SITE_DIR" \
    --branch="master"
}

function run {
  cd ..
  VERSION=$(readJsonProp "package.json" "version")

  # process new docs
  gulp docs --doc-version="$VERSION_NAME"

  # compile sass vars json for ionic-site docs
  gulp docs.sass-variables
  cp tmp/sass.json $SITE_DIR/docs/v2/theming/overriding-ionic-variables/

  #compile API Demos
  gulp demos

  # CD in to the site dir to commit updated docs
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
