#!/bin/sh

NG_FOLDER=node_modules/angular-master

cd $(dirname $0)/../../

$(test -e $NG_FOLDER) || (git clone git@github.com:angular/angular $NG_FOLDER)

cd $NG_FOLDER
echo "Running npm install in angular2..."
npm install

echo "Running gulp to build source..."
gulp build/transpile.js.dev.es6

echo "--"
echo "-- DONE, gulp will work now --"
echo "--"
