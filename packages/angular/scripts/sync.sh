#!/bin/bash

set -e

# Delete old packages
rm -f *.tgz

# Pack @ionic/core
npm pack ../../core

# Install Dependencies
# TODO(FW-xxxx): Remove --legacy-peer-deps once Angular 18 is released
npm install *.tgz --no-save --legacy-peer-deps
