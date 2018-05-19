#!/bin/sh

rm -rf ./node_modules/ionicons
cp -a ../core/node_modules/ionicons ./node_modules/ionicons
../core/node_modules/.bin/stencil build
