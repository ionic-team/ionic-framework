#!/bin/bash

set -e

# Delete old packages
rm -f *.tgz

# Pack @ionic/core
npm pack ../../core

# Pack @ionic/vue
npm pack ../vue

# Install Dependencies
npm install *.tgz --no-save
