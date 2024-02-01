#!/bin/bash

# The directory where the source
# for each specific application is.
APPS_DIR="apps"

# The directory where the
# base application logic is
BASE_DIR="base"
BUILD_DIR="build"

# The specific application
# we are building
APP_DIR="${1}"

# The full path to the specific application.
FULL_APP_DIR="${APPS_DIR}/${APP_DIR}/."

# The full path to the base application.
FULL_BASE_DIR="${BASE_DIR}/."

# The full path to the built application.
BUILD_APP_DIR="${BUILD_DIR}/${APP_DIR}/"

# Make sure the full app directory exists.
if [ ! -d $FULL_APP_DIR ]; then
  echo "Could not find test app: ${FULL_APP_DIR}"
  exit 1
fi

# Make the build directory if it does not already exist.
mkdir -p $BUILD_DIR

# First we need to copy the base application
cp -R $FULL_BASE_DIR $BUILD_APP_DIR

# Then we can copy the specific app which
# will override any files in the base application.
cp -R $FULL_APP_DIR $BUILD_APP_DIR

echo "Copied test app files for ${APP_DIR}"
