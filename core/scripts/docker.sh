#!/bin/bash
docker run -it --rm -e DISPLAY=$(cat docker-display.txt) -v $(cat docker-display-volume.txt) --ipc=host --mount=type=bind,source=$(pwd),target=/ionic ionic-playwright npm run test.e2e -- "$@"
