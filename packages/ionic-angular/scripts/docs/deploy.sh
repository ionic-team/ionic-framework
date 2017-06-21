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
}

function run {
  cd ..
  VERSION=$(readJsonProp "package.json" "version")

  # download and copy over API Demos
  ./node_modules/.bin/gulp demos.download
  ./node_modules/.bin/gulp docs.demos --production=true

  # if release, copy old version to seperate folder and blow out docs root api
  if $IS_RELEASE; then

    echo "BUILDING RELEASE DOCS"

    if [ -d "$DOCS_DEST/api" ]; then
      rm -R $DOCS_DEST/api
    fi
    if [ -d "$DOCS_DEST/nightly/api" ]; then
      rm -R $DOCS_DEST/nightly/api
    fi

    ./node_modules/.bin/gulp docs.dgeni --doc-version="$VERSION_NAME" --initial-build true
    ./node_modules/.bin/gulp docs.dgeni --doc-version="$VERSION_NAME"
    ./node_modules/.bin/gulp docs.dgeni --doc-version="nightly"

    ./node_modules/.bin/gulp docs.homepageVersionUpdate

  else

    if [ -d "$DOCS_DEST/nightly/api" ]; then
      rm -R $DOCS_DEST/nightly/api
    fi

    ./node_modules/.bin/gulp docs.dgeni --doc-version="$VERSION_NAME"

  fi

  # compile sass vars json for ionic-site docs
  ./node_modules/.bin/gulp docs.sassVariables
  cp tmp/sass.json $DOCS_DEST/theming/overriding-ionic-variables/

  # CD in to the site dir to commit updated docs
  cd $SITE_DIR

  CHANGES=$(git status --porcelain)

  # if no changes, don't commit
  if [[ "$CHANGES" == "" ]]; then
    echo "-- No changes detected for the following commit, docs not updated."
    echo "https://github.com/ionic-team/$CIRCLE_PROJECT_REPONAME/commit/$CIRCLE_SHA1"
  else
    git add -A
    git commit -am "Automated build of ionic  v$VERSION ionic-team/$CIRCLE_PROJECT_REPONAME@$CIRCLE_SHA1"
    # in case a different commit was pushed to ionic-site during doc/demo gen,
    # try to rebase around it before pushing
    git fetch
    git rebase

    git push origin master

    echo "-- Updated docs for $VERSION_NAME succesfully!"
  fi

}

source $(dirname $0)/../utils.sh.inc
