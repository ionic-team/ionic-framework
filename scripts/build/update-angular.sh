#!/bin/sh

NG_FOLDER=angular-master

cd $(dirname $0)/../..

cd dist
if ! [ $(ls | grep $NG_FOLDER) ]; then
  echo "Cloning angular2 to dist/angular-master..."
  git clone git@github.com:angular/angular $NG_FOLDER
fi

cd $NG_FOLDER
echo "Running npm install in angular2..."
npm install

echo "Running gulp to build source..."
gulp build/transpile.js.dev.es6

echo "-- DONE --"
