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
# TODO: Remove --legacy-peer-deps once @ionic/react peer deps align with test app versions.
# Currently needed because packed tarballs may have peer dep ranges that conflict with
# the specific React/React-Router versions in test apps.
npm install *.tgz --no-save --legacy-peer-deps
