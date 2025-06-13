#!/bin/bash

set -e

# Delete old packages
rm -f *.tgz

# Pack @ionic/react
npm pack ../react

# Pack @ionic/core
npm pack ../../core

# Install Dependencies
npm install *.tgz --no-save
