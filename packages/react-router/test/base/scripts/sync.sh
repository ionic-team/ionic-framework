#!/bin/bash

set -e

# Delete old packages
rm -f *.tgz

# Pack @ionic/core
npm pack ../../../../../core

# Pack @ionic/react
npm pack ../../../../react

# Pack @ionic/react-router
npm pack ../../../

# Install Dependencies
# TODO: Remove --legacy-peer-deps once @ionic/react peer deps align with test app versions.
# Currently needed because packed tarballs may have peer dep ranges that conflict with
# the specific React/React-Router versions in test apps.
npm install *.tgz --no-save --legacy-peer-deps
