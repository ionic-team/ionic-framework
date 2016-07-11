#!/bin/bash

echo "##### "
echo "##### ci/deploy.sh"
echo "#####"

function run {
  cd ../..
  export IONIC_DIR=$PWD

  # If --verbose is set on this script, export it to all the scripts
  export VERBOSE=$VERBOSE

  git config --global user.name 'Ionitron'
  git config --global user.email hi@ionicframework.com

  git show $CIRCLE_SHA1~1:package.json > .package.tmp.json
  OLD_VERSION=$(readJsonProp ".package.tmp.json" "version")
  VERSION=$(readJsonProp "package.json" "version")

  if [[ "$OLD_VERSION" != "$VERSION" ]]; then
    #./scripts/bump/release.sh --new-version="$VERSION"
    IS_RELEASE=true
    VERSION_NAME=$(readJsonProp "package.json" "version")
  else
    #./scripts/bump/nightly.sh --build-number=$BUILD_NUMBER
    IS_RELEASE=false
    VERSION_NAME="nightly"
  fi

  export IS_RELEASE=$IS_RELEASE
  export OLD_VERSION=$OLD_VERSION

  # Install gulp globally for site deploy script.
  # npm install -g gulp

  if [[ "$IS_RELEASE" == "true" ]]; then
    echo "RELEASE DETECTED!"
    # TODO bump version number, github release, changelog, CDN, docs nav update
  fi

  # Update docs
  ./scripts/docs/deploy.sh --version-name="$VERSION_NAME"


}

source $(dirname $0)/../utils.sh.inc
