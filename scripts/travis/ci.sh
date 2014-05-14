#!/bin/bash

# Task that runs every time CI server is pushed to

ARG_DEFS=(
)

function init {
  # If we are on travis, set our git credentials to make the travis commits look better
  if [[ "$TRAVIS" == "true" ]]; then
    git config --global user.name 'Ionitron'
    git config --global user.email hi@ionicframework.com
    export GH_ORG=driftyco
    export RELEASE_REMOTE=origin
  else
    # For testing if we aren't on travis
    export TRAVIS_BUILD_NUMBER=$RANDOM
    export TRAVIS_PULL_REQUEST=false
    export TRAVIS_COMMIT=$(git rev-parse HEAD)
    export TRAVIS_BRANCH=master
    # use your github username as GH_ORG to push to, and it will push to ORG/ionic-code, etc
    export GH_ORG=ajoslin
    export RELEASE_REMOTE=ajoslin
  fi
}

function run {
  cd ../..

  echo "GH_ORG=$GH_ORG"
  echo "RELEASE_REMOTE=$RELEASE_REMOTE"
  echo "TRAVIS_BRANCH=$TRAVIS_BRANCH"
  echo "TRAVIS_BUILD_NUMBER=$TRAVIS_BUILD_NUMBER"
  echo "TRAVIS_PULL_REQUEST=$TRAVIS_PULL_REQUEST"
  echo "TRAVIS_COMMIT=$TRAVIS_COMMIT"

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

  mkdir -p tmp
  git show $TRAVIS_COMMIT~1:package.json > tmp/package.old.json
  OLD_VERSION=$(readJsonProp "tmp/package.old.json" "version")
  VERSION=$(readJsonProp "package.json" "version")
  CODENAME=$(readJsonProp "package.json" "codename")

  if [[ "$OLD_VERSION" != "$VERSION" ]]; then
    IS_RELEASE=true
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

    ./scripts/travis/bump-nightly-version.sh
    VERSION=$(readJsonProp "package.json" "version")
    CODENAME=$(readJsonProp "package.json" "codename")
  fi

  # Build files after we are sure our version is correct
  gulp build --release

  if [[ $IS_RELEASE == "true" ]]; then

    ./scripts/travis/release-new-version.sh \
      --action="push" \
      --version=$VERSION
    ./scripts/travis/release-new-version.sh \
      --action="github" \
      --version=$VERSION \
      --old-version=$OLD_VERSION
    ./scripts/travis/release-new-version.sh \
      --action="discourse" \
      --version=$VERSION \
      --old-version=$OLD_VERSION

    # Version name used on the CDN/docs: nightly or the version
    VERSION_NAME=$VERSION

    ./scripts/site/publish.sh --action="clone"
    ./scripts/site/publish.sh --action="updateConfig"
    ./scripts/seed/publish.sh --version="$VERSION"
    ./scripts/app-base/publish.sh --version="$VERSION"

    ./scripts/travis/release-new-version.sh \
      --action="tweetAndIrc"
      --version=$VERSION
  else
    ./scripts/site/publish.sh --action="clone"

    VERSION_NAME="nightly"

    gulp changelog --standalone \
      --html=true \
      --subtitle="(changes since $OLD_VERSION)" \
      --dest="dist/CHANGELOG.html" \
      --from="$(git tag | grep $OLD_VERSION)"
  fi

  ./scripts/site/publish.sh \
    --action="docs" \
    --version-name="$VERSION_NAME"

  ./scripts/site/publish.sh \
    --action="demos" \
    --version-name="$VERSION_NAME"

  ./scripts/cdn/publish.sh \
    --version=$VERSION \
    --version-name="$VERSION_NAME"

  ./scripts/bower/publish.sh \
    --version="$VERSION" \
    --codename="$CODENAME"


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

