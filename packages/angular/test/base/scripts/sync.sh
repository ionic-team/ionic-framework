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
# TODO(FW-6227): Remove --legacy-peer-deps once Angular 18 is released
npm install *.tgz --no-save --legacy-peer-deps

# Delete Angular cache directory
rm -rf .angular/
