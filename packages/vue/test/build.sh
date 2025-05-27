#!/bin/bash

# Directory containing test application versions
# (e.g. vue2, vue3, etc.)
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
rsync -a --exclude='.git' --exclude='node_modules' $FULL_BASE_DIR $BUILD_APP_DIR

# Copy version-specific files (overrides base template)
echo "Copying application version..."
rsync -a --exclude='.git' --exclude='node_modules' $FULL_APP_DIR $BUILD_APP_DIR

# Remove files that don't exist in either source directory
echo "Cleaning up removed files..."
find $BUILD_APP_DIR -type f -not -path "*/node_modules/*" -not -path "*/.git/*" | while read file; do
    rel_path=${file#$BUILD_APP_DIR}
    if [ ! -f "${FULL_BASE_DIR}${rel_path}" ] && [ ! -f "${FULL_APP_DIR}${rel_path}" ]; then
        rm "$file"
    fi
done

echo "Copied test app files for ${APP_DIR}"
