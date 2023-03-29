#!/bin/bash

set -e

# Delete old packages
rm -rf *.tgz

# Pack @ionic/core
npm pack ../core

# Install Dependencies
npm install *.tgz --no-save
