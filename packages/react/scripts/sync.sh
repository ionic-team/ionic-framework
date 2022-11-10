#!/bin/bash

set -e

# Copy core dist
rm -rf node_modules/@ionic/core/dist node_modules/@ionic/core/components
cp -a ../../core/dist node_modules/@ionic/core/dist
cp -a ../../core/components node_modules/@ionic/core/components
cp -a ../../core/package.json node_modules/@ionic/core/package.json
