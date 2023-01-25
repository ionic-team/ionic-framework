#!/bin/bash

set -e

# Pack @ionic/core
npm pack ../../core

# Pack @ionic/vue
npm pack ./

# Pack @ionic/vue-router
npm pack ../vue-router

# Install Dependencies
npm install *.tgz --no-save
