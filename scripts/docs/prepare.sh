#!/bin/bash

echo "##### "
echo "##### prepare.sh"
echo "#####"


function init {
  cd ..
  SITE_PATH=$(readJsonProp "config.json" "sitePath")
  cd ..
  export IONIC_DIR=$PWD
  SITE_DIR=$IONIC_DIR/$SITE_PATH
}

function run {

  if [ ! -d "$SITE_DIR" ]; then
    echo "checking out"
    cd ./scripts
    ./git/clone.sh --repository="ionic-site" \
      --directory="$SITE_DIR" \
      --branch="master"
  else
    echo "using existing"
    cd $SITE_DIR
    git reset --hard
    git pull origin master
  fi
}

source $(dirname $0)/../utils.sh.inc
