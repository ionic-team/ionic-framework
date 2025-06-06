#!/bin/bash

# Directory containing test application versions
# (e.g. ng18, ng19, etc.)
APPS_DIR="apps"

# Base application template that all test apps are built from
BASE_DIR="base"

# Output directory for built applications
BUILD_DIR="build"

# Application version to build (passed as first argument)
APP_DIR="${1}"

# Full paths for source and destination
FULL_APP_DIR="${APPS_DIR}/${APP_DIR}/."
FULL_BASE_DIR="${BASE_DIR}/."
BUILD_APP_DIR="${BUILD_DIR}/${APP_DIR}/"

# Verify application version exists
if [ ! -d $FULL_APP_DIR ]; then
  echo "Could not find test app: ${FULL_APP_DIR}"
  exit 1
fi

# Create build directory if needed
mkdir -p $BUILD_DIR

# Copy base template first
echo "Copying base application..."
cp -R $FULL_BASE_DIR $BUILD_APP_DIR

# Copy version-specific files (overrides base template)
echo "Copying application version..."
cp -R $FULL_APP_DIR $BUILD_APP_DIR

echo "Copied test app files for ${APP_DIR}"
