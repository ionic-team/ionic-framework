#!/bin/bash

set -e

# Pack @ionic/core
npm pack ../core

# Pack @ionic/angular
npm pack ./

# Install Dependencies
npm install *.tgz --no-save
