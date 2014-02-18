#!/bin/bash

VER=$1

if [[ $VER == "" ]]; then
  echo '-- Usage: ./scripts/update-angular.sh <version>'
  echo '   example: ./scripts/update-angular.sh 1.2.10'
  exit 1
fi

cd $(dirname $0)/../config/lib/js/angular/

rm -rf *.js
wget http://code.angularjs.org/$VER/angular{,-animate,-mocks,-resource,-scenario,-animate.min,-resource.min,.min}.js
