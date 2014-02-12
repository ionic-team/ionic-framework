#!/bin/bash

# Task that runs every time CI server is pushed to

ARG_DEFS=(
)

function init {
  # If we are on travis, set our git credentials to make the travis commits look better
  if [[ "$TRAVIS" == "true" ]]; then
    git config --global user.name 'Ionotron'
    git config --global user.email hi@ionicframework.com
    export GH_ORG=driftyco
  else
    # For testing if we aren't on travis
    export TRAVIS_BUILD_NUMBER=$RANDOM
    export TRAVIS_PULL_REQUEST=false
    export TRAVIS_COMMIT=$(git rev-parse HEAD)
    export TRAVIS_BRANCH=master
    # use your github username as GH_ORG to push to, and it will push to ORG/ionic-code, etc
    export GH_ORG=somethingnew2-0
  fi
}

function run {
  cd ../..

  echo "GH_ORG=$GH_ORG"
  echo "TRAVIS_BRANCH=$TRAVIS_BRANCH"
  echo "TRAVIS_BUILD_NUMBER=$TRAVIS_BUILD_NUMBER"
  echo "TRAVIS_PULL_REQUEST=$TRAVIS_PULL_REQUEST"
  echo "TRAVIS_COMMIT=$TRAVIS_COMMIT"

  # Jshint & check for stupid mistakes
  grunt jshint ddescribe-iit merge-conflict

  # Run simple quick tests on Phantom to be sure any tests pass
  grunt karma:single --browsers=PhantomJS --reporters=dots

  # Do sauce test with all browsers (takes longer)
  # TODO Saucelabs settings need more tweaking before it becomes stable (sometimes it fails to connect)
  # grunt karma:sauce --reporters=dots

  if [[ "$TRAVIS_PULL_REQUEST" != "false" ]]; then
    echo "-- This is a pull request build; will not push build out."
    exit 0
  fi
  
  LATEST_TAG_COMMIT=$(git rev-list $(git describe --tags --abbrev=0) | head -n 1)

  if [[ "$TRAVIS_COMMIT" == "$LATEST_TAG_COMMIT" ]]; then
    IS_RELEASE=true
    echo "##################################"
    echo "# Pushing out a new full release #"
    echo "##################################"
  else
    if [[ "$TRAVIS_BRANCH" != "master" ]]; then
      echo "-- We are not on branch master, instead we are on branch $TRAVIS_BRANCH. Will not push build out."
      exit 0
    fi
    echo "#####################################"
    echo "# Pushing out a new nightly release #"
    echo "#####################################"
    ./scripts/travis/bump-nightly-version.sh
  fi

  # Build (make sure to build after version is bumped)
  grunt build
  grunt removelogging

  # Version label used on the CDN: nightly or the version name
  if [[ $IS_RELEASE == "true" ]]; then
    VERSION_LABEL=$(readJsonProp "package.json" "version")
  else
    VERSION_LABEL="nightly"
  fi

  ./scripts/cdn/publish.sh --version-label="$VERSION_LABEL"

  ./scripts/bower/publish.sh

  if [[ $IS_RELEASE == "true" ]]; then
    ./scripts/seed/publish.sh
    ./scripts/site/publish.sh
  fi

  echo "--- Build Complete! ----"
}

source $(dirname $0)/../utils.inc

