#!/bin/bash

ARG_DEFS=(
  "--repository=(.*)"
  "--directory=(.*)"
  "[--depth=(.*)]"
  "[--branch=(.*)]"
)

function run {
  rm -rf $DIRECTORY
  mkdir -p $DIRECTORY

  echo "-- Cloning $REPOSITORY#$BRANCH to $DIRECTORY..."

  ARGS="--branch=${BRANCH:-master}"
  if [[ "$DEPTH" != "" ]]; then
    ARGS="$ARGS --depth=$DEPTH"
  else
    ARGS="$ARGS --depth=2"
  fi
  git clone https://driftyco:$GH_TOKEN@github.com/$REPOSITORY $DIRECTORY $ARGS
  cd $DIRECTORY
  git fetch origin --tags
  cd ../
}

source $(dirname $0)/../utils.sh.inc
