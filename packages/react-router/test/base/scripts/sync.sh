#!/bin/bash

set -e

# Pack @ionic/core
npm pack ../../../../../core

# Pack @ionic/react
npm pack ../../../../react

# Pack @ionic/react-router
npm pack ../../../

# Install Dependencies
npm install *.tgz --no-save
