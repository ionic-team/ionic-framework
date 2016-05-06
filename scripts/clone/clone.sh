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

  ARGS="--branch=${BRANCH:-master} --depth=3"
  if [[ "$DEPTH" != "" ]]; then
    ARGS="$ARGS --depth=$DEPTH"
  fi

  git config --global user.email "hi@ionicframework.com"
  git config --global user.name "Ionitron"

  git clone git@github.com:driftyco/$REPOSITORY.git $DIRECTORY $ARGS
  cd $DIRECTORY
  git fetch origin --tags
  cd ../
}

source $(dirname $0)/../utils.inc
