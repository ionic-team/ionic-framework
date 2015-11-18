#!/bin/bash

ARG_DEFS=(
  "--sha1=(.*)"
  "--index=(.*)"
  "--build-number=(.*)"
)

function run {
  cd ../..

  # If --git-push-dryrun or --verbose is set on this script,
  # export it to all the scripts
  export GIT_PUSH_DRYRUN=$GIT_PUSH_DRYRUN
  export VERBOSE=$VERBOSE

  git config --global user.name 'Ionitron'
  git config --global user.email hi@ionicframework.com

  git show $SHA1~1:package.json > .package.tmp.json
  OLD_VERSION=$(readJsonProp ".package.tmp.json" "version")
  VERSION=$(readJsonProp "package.json" "version")

  if [[ "$OLD_VERSION" != "$VERSION" ]]; then
    ./scripts/bump/release.sh --new-version="$VERSION"
    IS_RELEASE=true
    VERSION_NAME=$(readJsonProp "package.json" "version")
  else
    ./scripts/bump/nightly.sh --build-number=$BUILD_NUMBER
    VERSION_NAME="nightly"
  fi



  # We have to install jekyll for the site task.
  # gem install jekyll --pre && gem install jekyll-paginate
  # Install gulp globally for site deploy script.
  npm install -g gulp

  if [[ "$IS_RELEASE" == "true" ]]; then
    ./scripts/release/publish.sh
    ./scripts/app-base/publish.sh
    ./scripts/site/config.sh
  fi

  # Update docs
  ./scripts/site/docs.sh --version-name="$VERSION_NAME"

  # Update cdn
  ./scripts/cdn/publish.sh --version-name="$VERSION_NAME" --old-version="$OLD_VERSION"
  # Update bower
  ./scripts/bower/publish.sh


  # case $INDEX in
  # 0)
  #   # Push release to ionic repo: release only
  #   if [[ "$IS_RELEASE" == "true" ]]; then
  #     ./scripts/release/publish.sh
  #     # node_modules/.bin/gulp release-discourse
  #     # node_modules/.bin/gulp release-github
  #     # node_modules/.bin/gulp release-tweet
  #     # node_modules/.bin/gulp release-irc
  #   fi
  #   ;;
  # 1)
  #   # Update app-base: release only
  #   if [[ "$IS_RELEASE" == "true" ]]; then
  #     ./scripts/app-base/publish.sh
  #   fi
  #   ;;
  # 2)
  #   # We have to install jekyll for the site task for now.
  #   gem install jekyll --pre
  #   # Install gulp globally for site deploy script.
  #   npm install -g gulp
  #
  #   # Be sure to update the site one after the other,
  #   # so the tasks don't have a push conflict
  #   if [[ "$IS_RELEASE" == "true" ]]; then
  #     ./scripts/site/config.sh
  #   fi
  #   # Update docs
  #   ./scripts/site/docs.sh --version-name="$VERSION_NAME"
  #   ;;
  # 3)
  #   # Update demos
  #   # ./scripts/demo/publish.sh --version-name="$VERSION_NAME"
  #   # Update cdn
  #   ./scripts/cdn/publish.sh --version-name="$VERSION_NAME" --old-version="$OLD_VERSION"
  #   # Update bower
  #   ./scripts/bower/publish.sh
  #   ;;
  # 4)
  #   # Update cdn
  #   # ./scripts/cdn/publish.sh --version-name="$VERSION_NAME" --old-version="$OLD_VERSION"
  #   ;;
  # 5)
  #   # Update bower
  #   # ./scripts/bower/publish.sh
  #   ;;
  # esac
}

source $(dirname $0)/../utils.inc
