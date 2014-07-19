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

  git clone https://driftyco:$GH_TOKEN@github.com/$REPOSITORY $DIRECTORY \
    --depth=${DEPTH:-1} \
    --branch=${BRANCH:-master}
}

source $(dirname $0)/../utils.inc

