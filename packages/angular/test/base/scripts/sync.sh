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
npm install *.tgz --no-save

# Delete Angular cache directory
rm -rf .angular/
