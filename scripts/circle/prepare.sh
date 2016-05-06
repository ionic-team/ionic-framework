#!/bin/bash

ARG_DEFS=(
  "--index=(.*)"
  "--total=(.*)"
)

function init {

}

function run {
  ../site/prepare.sh
}

source $(dirname $0)/../utils.inc
