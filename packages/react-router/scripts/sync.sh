#!/bin/bash

set -e

# Copy ionic react dist
rm -rf node_modules/@ionic/react/dist node_modules/@ionic/react/css
cp -a ../react/dist node_modules/@ionic/react/dist
cp -a ../react/css node_modules/@ionic/react/css
cp -a ../react/package.json node_modules/@ionic/react/package.json

# Copy core dist
rm -rf node_modules/@ionic/core/dist node_modules/@ionic/core/components
cp -a ../../core/dist node_modules/@ionic/core/dist
cp -a ../../core/components node_modules/@ionic/core/components
cp -a ../../core/package.json node_modules/@ionic/core/package.json
