#!/bin/bash

# Task that runs every time CI server is pushed to

ARG_DEFS=(
)

function init {
  # If we are on travis, set our git credentials to make the travis commits look better
  if [[ "$TRAVIS" == "true" ]]; then
    git config --global user.name 'Ionitron'
    git config --global user.email hi@ionicframework.com
  fi
}

function run {
  cd ../..


  # for testing, use your fork as GH_ORG to push to
  export GH_ORG=driftyco

  if [[ "$TRAVIS" != "true" ]]; then
    export TRAVIS_BRANCH=master
  fi

  echo "-- Building on branch $TRAVIS_BRANCH for organization $GH_ORG"

  # Jshint & check for stupid mistakes
  grunt jshint ddescribe-iit merge-conflict

  # Run simple quick tests on Phantom to be sure any tests pass
  grunt karma:single --browsers=PhantomJS --reporters=dots

  # Build
  grunt build

  # Do sauce test with all browsers (takes longer)
  # TODO Saucelabs settings need more tweaking before it becomes stable (sometimes it fails to connect)
  # grunt karma:sauce --reporters=dots

  if [[ "$TRAVIS_BRANCH" != "master" ]]; then
    echo "-- Building on branch $TRAVIS_BRANCH (not master); will not push build out."
    exit 0
  fi
  if [[ "$TRAVIS_PULL_REQUEST" == "true" ]]; then
    echo "-- This is a pull request build; will not push build out."
    exit 0
  fi

  # if the latest tag points to this commit, then treat
  # this as a release
  LATEST_TAG_COMMIT=$(git rev-list --tags --max-count=1)
  HEAD_COMMIT=$(git rev-parse HEAD)
  if [ "$LATEST_TAG_COMMIT" == "$HEAD_COMMIT" ]; then
    IS_RELEASE=true
    echo "-- Pushing out a new full release."
  else
    echo "-- Pushing out a new nightly build."
    ./scripts/travis/bump-nightly-version.sh
  fi

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
  fi

  echo "--- Build Complete! ----"
}

source $(dirname $0)/../utils.inc

