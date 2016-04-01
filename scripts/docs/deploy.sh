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

  #compile API Demos
  gulp demos --production=true

  # process new docs
  gulp docs --doc-version="$VERSION_NAME"

  # compile sass vars json for ionic-site docs
  gulp docs.sass-variables
  cp tmp/sass.json $SITE_DIR/docs/v2/theming/overriding-ionic-variables/

  # CD in to the site dir to commit updated docs
  cd $SITE_DIR

  CHANGES=$(git status --porcelain)

  # if no changes, don't commit
  if [[ "$CHANGES" == "" ]]; then
    echo "-- No changes detected for the following commit, docs not updated."
    echo "https://github.com/driftyco/$CIRCLE_PROJECT_REPONAME/commit/$CIRCLE_SHA1"
  else
    git add -A
    git commit -am "Automated build of ionic  v$VERSION driftyco/$CIRCLE_PROJECT_REPONAME@$CIRCLE_SHA1"
    git push origin master

    echo "-- Updated docs for $VERSION_NAME succesfully!"
  fi

}

source $(dirname $0)/../utils.sh.inc
