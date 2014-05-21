#!/bin/bash

ARG_DEFS=(
  "--version=(.*)"
  "[--old-version=(.*)]"
  "--action=(.*)"
)

function init {
  TMP_DIR=$SCRIPT_DIR/../../tmp
  BUILD_DIR=$SCRIPT_DIR/../../dist
  PROJECT_DIR=$SCRIPT_DIR/../..

  IONIC_DIR=$TMP_DIR/ionic
}

function push {

  echo "##############################"
  echo "# Pushing release $VERSION   #"
  echo "##############################"

  cd ../..

  rm -rf $IONIC_DIR
  mkdir -p $IONIC_DIR

  echo "-- Cloning ionic master ..."
  git clone https://$GH_ORG:$GH_TOKEN@github.com/$GH_ORG/ionic.git \
    $IONIC_DIR \
    --depth=10

  cd $IONIC_DIR

  # Get first codename in list
  CODENAME=$(readJsonProp "$PROJECT_DIR/package.json" "codename")

  replaceJsonProp "package.json" "version" "$VERSION"
  replaceJsonProp "bower.json" "version" "$VERSION"
  replaceJsonProp "component.json" "version" "$VERSION"

  echo "-- Putting built files into release folder"
  mkdir -p release
  cp -Rf $PROJECT_DIR/dist/* release

  git add -A
  git commit -m "finalize-release: v$VERSION \"$CODENAME\""
  git tag -f -m "v$VERSION" v$VERSION

  git push -q $RELEASE_REMOTE master
  git push -q $RELEASE_REMOTE v$VERSION

  echo "-- v$VERSION \"$CODENAME\" pushed to $RELEASE_REMOTE/master successfully!"
}

# Unused. TODO remove and rewrite as node.js script
function github {
  echo "-- Pushing out github release..."

  # Get only newest things in changelog - sed until previous version is hit
  sed -e '/'"$OLD_VERSION"'/,$d' $PROJECT_DIR/CHANGELOG.md | tail -n +3 \
    > $TMP_DIR/CHANGELOG_NEW.md

  CODENAME=$(readJsonProp "$IONIC_DIR/package.json" "codename")

  # we have to get all releases, then find the one corresponding to this new tag
  curl https://api.github.com/repos/$GH_ORG/ionic/releases > $TMP_DIR/releases.json

  node -e "var releases = require('$TMP_DIR/releases.json'); \
    var id; \
    releases.forEach(function(r) { \
      if (r.tag_name == 'v$VERSION') { \
        id = r.id; \
      } \
    }); \
    require('fs').writeFileSync('$TMP_DIR/RELEASE_ID', id || '');"

  node -e "var fs = require('fs'); \
    fs.writeFileSync('$TMP_DIR/github.json', JSON.stringify({ \
      name: \"v$VERSION '$CODENAME'\", \
      tag_name: \"v$VERSION\", \
      body: fs.readFileSync('$TMP_DIR/CHANGELOG_NEW.md').toString() \
    }));"

  RELEASE_ID=$(cat $TMP_DIR/RELEASE_ID)
  if [[ "$RELEASE_ID" == "" ]]; then
    curl -X POST https://api.github.com/repos/$GH_ORG/ionic/releases \
      -H "Authorization: token $GH_TOKEN" \
      --data-binary @$TMP_DIR/github.json
  else
    curl -X PATCH https://api.github.com/repos/$GH_ORG/ionic/releases/$RELEASE_ID \
      -H "Authorization: token $GH_TOKEN" \
      --data-binary @$TMP_DIR/github.json
  fi


  echo "-- Github release pushed out successfully!"
}

# Unused. TODO remove and rewrite as node.js script
function discourse {
  CODENAME=$(readJsonProp "$IONIC_DIR/package.json" "codename")
  # Get only newest things in changelog - sed until previous version is hit
  sed -e '/'"$OLD_VERSION"'/,$d' $PROJECT_DIR/CHANGELOG.md | tail -n +3 \
    > $TMP_DIR/NEW_CHANGELOG.md

  node -e "var fs=require('fs'); \
    fs.writeFileSync('$TMP_DIR/discourse.json', \
      \"api_key=$DISCOURSE_TOKEN\" + \
      \"&api_username=Ionitron\" + \
      \"&title=\" + encodeURIComponent(\"v$VERSION '$CODENAME' Released!\") + \
      \"&raw=\" + encodeURIComponent(\"Download Instructions: https://github.com/driftyco/ionic#quick-start\n\n\" + fs.readFileSync('$TMP_DIR/CHANGELOG_NEW.md').toString()) \
    )";

  curl -X POST http://forum.ionicframework.com/posts \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    --data-binary @$TMP_DIR/discourse.json \
    > $TMP_DIR/discourse-response.json

  touch $IONIC_DIR/config/RELEASE_POST_URL
  OLD_POST_URL=$(cat $IONIC_DIR/config/RELEASE_POST_URL)
  if [[ "$OLD_POST_URL" != "" ]]; then
    curl -X PUT "$OLD_POST_URL/status" --data "api_key=$DISCOURSE_TOKEN&api_username=Ionitron&status=pinned&enabled=false"
  fi

  POST_URL=`node -e "var res = require('$TMP_DIR/discourse-response.json'); \
    console.log(\"http://forum.ionicframework.com/t/\" + res.topic_slug + \"/\" + res.topic_id);"`
  echo $POST_URL > $IONIC_DIR/config/RELEASE_POST_URL

  curl -X PUT "$POST_URL/status" \
    --data "api_key=$DISCOURSE_TOKEN&api_username=Ionitron&status=pinned&enabled=true"
  # curl -X PUT "$POST_URL/status" \
  #   --data "api_key=$DISCOURSE_TOKEN&api_username=Ionitron&status=closed&enabled=true"

  cd $IONIC_DIR
  git add config
  git commit config -m 'chore(release): update discourse post url'
  git push -q origin master
}

function tweetAndIrc {
  cd $IONIC_DIR
  gulp release-tweet release-irc
}

source $(dirname $0)/../utils.inc
