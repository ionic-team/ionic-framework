#!/bin/bash

set -e

# Delete old packages
rm -f *.tgz

# Delete vite cache
rm -rf node_modules/.vite

# Pack @ionic/core
npm pack ../../core

# Pack @ionic/vue-router
npm pack ../vue-router

# Install Dependencies
npm install *.tgz --no-save
