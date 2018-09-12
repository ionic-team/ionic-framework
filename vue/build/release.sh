#!/bin/bash

set -e
echo "Enter release version: "
read VERSION

read -p "Releasing $VERSION - are you sure? (y/n)" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "Releasing $VERSION ..."
  VERSION=$VERSION npm run prod

  # commit
  git add -A
  git commit --allow-empty -m "[build] $VERSION"
  npm version $VERSION --message "[release] $VERSION"

  # publish
  git push origin refs/tags/v$VERSION
  git push
  npm publish
fi
