#!/bin/bash

set -e

# Pack @ionic/core
npm pack ../../core

# Pack @ionic/vue
npm pack ../vue

# Pack @ionic/vue-router
npm pack ./

# Install Dependencies
npm install *.tgz
