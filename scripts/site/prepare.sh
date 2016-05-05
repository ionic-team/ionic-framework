#!/bin/bash

echo "##### "
echo "##### prepare.sh"
echo "#####"


function init {
  cd ..
  SITE_PATH=../ionic-site
  cd ..
  export IONIC_DIR=$PWD
  SITE_DIR=$IONIC_DIR/$SITE_PATH
}

function run {

  if [ ! -d "$SITE_DIR" ]; then
    echo "checking out"
    cd ./scripts
    ./clone/clone.sh --repository="ionic-site" \
      --directory="$SITE_DIR" \
      --branch="master"
    ls -al $SITE_DIR
  else
    echo "using existing"
    cd $SITE_DIR
    git reset --hard
    git pull origin master
  fi
}

source $(dirname $0)/../utils.inc
