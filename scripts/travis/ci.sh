#!/bin/bash

# Task that runs every time CI server is pushed to

ARG_DEFS=(
)

function init {
  # If we are on travis, set our git credentials to make the travis commits look better
  if [[ "$TRAVIS" == "true" ]]; then
    git config --global user.name 'Ionitron'
    git config --global user.email hi@ionicframework.com
    export GIT_PUSH_DRYRUN="false"
  else
    # For testing if we aren't on travis
    export TRAVIS_BUILD_NUMBER=$RANDOM
    export TRAVIS_PULL_REQUEST=false
    export TRAVIS_COMMIT=$(git rev-parse HEAD)
    export TRAVIS_BRANCH=master
    export GIT_PUSH_DRYRUN="true"
  fi
}

function run {
  cd ../..

  echo "GH_ORG=driftyco"
  echo "TRAVIS_BRANCH=$TRAVIS_BRANCH"
  echo "TRAVIS_BUILD_NUMBER=$TRAVIS_BUILD_NUMBER"
  echo "TRAVIS_PULL_REQUEST=$TRAVIS_PULL_REQUEST"
  echo "TRAVIS_COMMIT=$TRAVIS_COMMIT"
  echo "GIT_PUSH_DRYRUN=$GIT_PUSH_DRYRUN"

  # check for stupid mistakes
  gulp jshint
  gulp ddescribe-iit

  # Run simple quick tests on Phantom to be sure any tests pass
  # Tests are run on cloud browsers after build
  gulp karma --browsers=PhantomJS --reporters=dots

  if [[ "$TRAVIS_PULL_REQUEST" != "false" ]]; then
    echo "-- This is a pull request build; will not push build out."
    exit 0
  fi

  git show $TRAVIS_COMMIT~1:package.json > package-old.json.tmp
  OLD_VERSION=$(readJsonProp "package-old.json.tmp" "version")

  VERSION=$(readJsonProp "package.json" "version")
  CODENAME=$(readJsonProp "package.json" "codename")

  if [[ "$OLD_VERSION" != "$VERSION" ]]; then
    IS_RELEASE=true

    # Get first codename in list
    CODENAME=$(cat config/CODENAMES | head -n 1)
    # Remove first line of codenames, it's used now
    echo "`tail -n +2 config/CODENAMES`" > config/CODENAMES

    replaceJsonProp "package.json" "codename" "$CODENAME"
    replaceJsonProp "bower.json" "codename" "$CODENAME"
    replaceJsonProp "component.json" "codename" "$CODENAME"

    echo "#######################################"
    echo "# Releasing v$VERSION \"$CODENAME\"! #"
    echo "#######################################"
  else
    if [[ "$TRAVIS_BRANCH" != "master" ]]; then
      echo "-- We are not on branch master, instead we are on branch $TRAVIS_BRANCH. Aborting build."
      exit 0
    fi
    echo "#####################################"
    echo "# Pushing out a new nightly release #"
    echo "#####################################"

    CURRENT_VERSION=$VERSION
    VERSION="$CURRENT_VERSION-nightly-$TRAVIS_BUILD_NUMBER"
    replaceJsonProp "package.json" "version" "$VERSION"

    echo "-- Build version is $NEW_VERSION."
  fi

  export IONIC_DIR=$PWD
  export IONIC_SCSS_DIR=$IONIC_DIR/scss
  export IONIC_DIST_DIR=$IONIC_DIR/dist
  export IONIC_BUILD_DIR=$IONIC_DIR/dist/build

  mkdir -p $IONIC_DIST_DIR $IONIC_BUILD_DIR
  gulp build --release --dist="$IONIC_BUILD_DIR"

  echo "IONIC_DIR=$IONIC_DIR"
  echo "IONIC_SCSS_DIR=IONIC_SCSS_DIR=$IONIC_SCSS_DIR"
  echo "IONIC_DIST_DIR=$IONIC_DIST_DIR"
  echo "IONIC_BUILD_DIR=$IONIC_BUILD_DIR"


  if [[ $IS_RELEASE == "true" ]]; then

    ./scripts/travis/release-new-version.sh \
      --action="push" \
      --version=$VERSION

    # Version name used on the CDN/docs: nightly or the version
    VERSION_NAME=$VERSION

    ./scripts/site/publish.sh --action="updateConfig"
    ./scripts/app-base/publish.sh --version="$VERSION"

    gulp release-tweet
    gulp release-irc

  else

    VERSION_NAME="nightly"

    gulp changelog --standalone \
      --html=true \
      --subtitle="(changes since $OLD_VERSION)" \
      --dest="$IONIC_BUILD_DIR/CHANGELOG.html" \
      --from="$(git tag | grep $OLD_VERSION)"
  fi

  ./scripts/site/publish.sh \
    --action="docs" \
    --version-name="$VERSION_NAME"

  ./scripts/cdn/publish.sh \
    --version=$VERSION \
    --version-name="$VERSION_NAME"

  ./scripts/bower/publish.sh \
    --version="$VERSION" \
    --codename="$CODENAME"

  ./scripts/demo/publish.sh \
    --version-name="$VERSION_NAME"


  if [[ "$IS_RELEASE" == "true" ]]; then
    echo "################################################"
    echo "# Complete! v$VERSION \"$CODENAME\" published! #"
    echo "################################################"
  else
    echo "##########################"
    echo "# Running cloud tests... #"
    echo "##########################"

    # Do sauce unit tests and e2e tests with all browsers (takes longer)
    # gulp cloudtest

    echo "##########################################"
    echo "# Complete! v$VERSION nightly published! #"
    echo "##########################################"
  fi
}

source $(dirname $0)/../utils.inc
