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
  DOCS_DEST=$(readJsonProp "config.json" "docsDest")

  if [ ! -d "$SITE_DIR" ]; then
    echo "checking out"
    ./git/clone.sh --repository="driftyco/ionic-site" \
      --directory="$SITE_DIR" \
      --branch="master" \
      --depth=1
  else
    echo "using existing"
    cd $SITE_DIR
    git reset --hard
    git pull origin master
    cd $IONIC_DIR/scripts
  fi
}

function run {
  cd ..
  VERSION=$(readJsonProp "package.json" "version")

  #compile API Demos
  ./node_modules/.bin/gulp demos --production=true

  # process new docs
  rm -R $DOCS_DEST/api
  ./node_modules/.bin/gulp docs --doc-version="$VERSION_NAME"

  # compile sass vars json for ionic-site docs
  ./node_modules/.bin/gulp docs.sass-variables
  cp tmp/sass.json $DOCS_DEST/theming/overriding-ionic-variables/

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
