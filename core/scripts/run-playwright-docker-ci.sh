#!/bin/bash

# Run docker container and execute playwright tests
# Do not pass -it since we do not need this session to be interactive (since it will run on CI)
# We also do not set -e and -v to run in headed mode.

# Set "$@" to pass an arguments to the playwright command
docker run -e CI='true' --rm --ipc=host --mount=type=bind,source=./,target=/ionic ionic-playwright npm run test.e2e -- "$@"
