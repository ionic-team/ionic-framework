#!/bin/bash

set -e

# Pack @ionic/core
npm pack ../../../../core

# Pack @ionic/angular
npm pack ../../../dist

# Pack @ionic/angular-server
npm pack ../../../../packages/angular-server/dist

# Install Dependencies
npm install *.tgz --no-save
