#!/bin/bash

ARG_DEFS=(
  "--version=(.*)"
)
function run {
  PROJECT_DIR=$SCRIPT_DIR/../

  cd $SCRIPT_DIR/../config/lib/js/angular/
  rm -rf *.js

  wget http://code.angularjs.org/$VERSION/angular{,-sanitize,-animate,-resource}{.min.js,.js}

  # # no min versions of mocks and scenario
  wget http://code.angularjs.org/$VERSION/angular{-scenario,-mocks}.js

  cd $PROJECT_DIR

  echo "Setting bower.json angular versions to ~$VERSION"

  replaceJsonProp "bower.json" "angular" "~$VERSION"
  replaceJsonProp "bower.json" "angular-animate" "~$VERSION"
  replaceJsonProp "bower.json" "angular-sanitize" "~$VERSION"
}

source $(dirname $0)/utils.inc
