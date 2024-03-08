#!/bin/bash

set -e

# Delete old packages
rm -f *.tgz

# Pack @ionic/core
npm pack ../../../../../core

# Pack @ionic/react
npm pack ../../../

# Pack @ionic/react-router
npm pack ../../../../react-router

# Install Dependencies
npm install *.tgz --no-save
