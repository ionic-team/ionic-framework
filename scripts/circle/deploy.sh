#!/bin/bash

ARG_DEFS=(
  "[--is-release=(true|false)]"
  "--version-name=(.*)"
)

function run {
  cd ../..

  git config --global user.name 'Ionitron'
  git config --global user.email hi@ionicframework.com

  if [[ "$IS_RELEASE" == "true" ]]; then
    ./scripts/bump/release.sh --new-version="TEST"
  else
    ./scripts/bump/nightly.sh --build-number=$CIRCLE_BUILD_NUM
  fi

  case $CIRCLE_NODE_INDEX in
  0)
    # Push release to ionic repo: release only
    if [[ "$IS_RELEASE" == "true" ]]; then
      ./scripts/release/publish.sh
      node_modules/.bin/gulp release-tweet
      node_modules/.bin/gulp release-irc
    fi
    ;;
  1)
    # Update site config: release only
    if [[ "$IS_RELEASE" == "true" ]]; then
      ./scripts/site/config.sh
    fi
    # Update app-base: release only
    if [[ "$IS_RELEASE" == "true" ]]; then
      ./scripts/app-base/publish.sh
    fi
    ;;
  2)
    # Update docs
    ./scripts/site/docs.sh --version-name="$VERSION_NAME"
    ;;
  3)
    # Update demos
    ./scripts/demo/publish.sh --version-name="$VERSION_NAME"
    ;;
  4)
    # Update cdn
    ./scripts/cdn/publish.sh --version-name="$VERSION_NAME"
    ;;
  5)
    # Update bower
    ./scripts/bower/publish.sh
    ;;
  esac
}

source $(dirname $0)/../utils.inc
