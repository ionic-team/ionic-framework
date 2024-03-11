#!/bin/bash

# Run docker container and execute playwright tests
# -e and -v allow us to run playwright in a headed environment
# if --headed is passed

# Set "$@" to pass an arguments to the playwright command
docker run -it --rm \
-e DISPLAY=host.docker.internal:0 \
-v /tmp/.X11-unix:/tmp/.X11-unix \
--ipc=host --mount=type=bind,source=./,target=/ionic ionic-playwright npm run test.e2e -- "$@"
