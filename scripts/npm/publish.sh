#!/bin/bash

ARG_DEFS=(
)

echo "##### "
echo "##### npm/publish.sh"
echo "#####"

function init {

}

function run {
  cd ../..
  echo "-- Getting the latest change from github"

  git pull --rebase --prune && git submodule update --init --recursive
  VERSION=$(readJsonProp "package.json" "version")
  CODENAME=$(readJsonProp "package.json" "codename")

  echo -e "$NPM_USERNAME\n$NPM_PASSWORD\n$NPM_EMAIL" | npm login
  npm publish

  echo "-- Published ionic-sdk v$VERSION to npm successfully!"
}

source $(dirname $0)/../utils.inc
