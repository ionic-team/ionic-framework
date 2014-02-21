#!/bin/bash

ARG_DEFS=(
  "--version=(.*)"
)
function run {

  cd $SCRIPT_DIR/..//config/lib/js/angular/
  rm -rf *.js
  wget http://code.angularjs.org/$VERSION/angular{,-animate,-mocks,-resource,-scenario,-animate.min,-resource.min,.min,-sanitize,-sanitize.min}.js

  cd $SCRIPT_DIR/../

  replaceJsonProp "bower.json" "angular" $VERSION
  replaceJsonProp "bower.json" "angular-animate" $VERSION
  replaceJsonProp "bower.json" "angular-sanitize" $VERSION
}

source $(dirname $0)/utils.inc
