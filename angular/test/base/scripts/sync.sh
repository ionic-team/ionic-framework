#!/bin/bash

set -e

# Pack @ionic/core
npm pack ../../../../core

# Pack @ionic/angular
npm pack ../../../

# Pack @ionic/angular-server
npm pack ../../../../packages/angular-server

# Install Dependencies
npm install *.tgz --no-save
