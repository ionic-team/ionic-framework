#!/bin/bash

set -e

# Pack @ionic/core
npm pack ../core

# Install Dependencies
npm install *.tgz --no-save
