#!/bin/bash

set -e

# Delete old packages
rm -f *.tgz

# Pack @ionic/core
npm pack ../../../../../core

# Pack @ionic/angular
npm pack ../../../dist

# Pack @ionic/angular-server
npm pack ../../../../angular-server/dist

# Install Dependencies
# TODO: Remove --legacy-peer-deps once @angular-eslint reaches v22; the ng22 app pins
# @angular/cli@^22 while @angular-eslint@21 peer-requires @angular/cli ">=21 <22".
npm install *.tgz --no-save --legacy-peer-deps

# Delete Angular cache directory
rm -rf .angular/
