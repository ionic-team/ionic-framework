#!/bin/bash

# Task that runs every time CI server is pushed to

ARG_DEFS=(
)

# function init {
  # for pushing docs/cdn
  # git config --global user.name 'Ionic Roboman'
  # git config --global user.email ionic.roboman@drifty.com
# }

function run { 
  cd ../..

  # Build / JSHint
  grunt jshint
  # TODO Check for things like iit / ddescribe / merge conflicts / leftover console.log

  # Do a cursory test with PhantomJS
  # just so we can quickly fail if some tests fail
  grunt karma:single --browsers=PhantomJS --reporters=dots

  # Do sauce test with all browsers (takes longer)
  # Saucelabs settings need more tweaking before it becomes stable (sometimes it fails)
  # grunt karma:sauce --reporters=dots

  # TODO Build docs
  # TODO Push to CDN
}

source $(dirname $0)/../utils.inc

