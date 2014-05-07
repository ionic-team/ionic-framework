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
  CODENAME=$(cat config/CODENAMES | head -n 1)
  # Remove first line of codenames, it's used now
  sed -i '' 1d config/CODENAMES

  replaceJsonProp "bower.json" "version" "$VERSION"
  replaceJsonProp "component.json" "version" "$VERSION"

  replaceJsonProp "package.json" "codename" "$CODENAME"
  replaceJsonProp "bower.json" "codename" "$CODENAME"
  replaceJsonProp "component.json" "codename" "$CODENAME"

  echo "-- Putting built files into release folder"
  mkdir -p release
  cp -Rf $PROJECT_DIR/dist/* release

  git add -A
  git commit -m "finalize-release: v$VERSION \"$CODENAME\""
  git tag -f -m "v$VERSION" v$VERSION

  git push -q $RELEASE_REMOTE master
  git push -q $RELEASE_REMOTE v$VERSION

  echo "-- v$VERSION \"$CODENAME\" pushed to $RELEASE_REMOTE/master successfully!"
  gulp release-tweet release-irc
}

function github {
  # Get only newest things in changelog - sed until previous version is hit
  sed -e '/'"$OLD_VERSION"'/,$d' $PROJECT_DIR/CHANGELOG.md | tail -n +3 \
    > $TMP_DIR/CHANGELOG_NEW.md

  CODENAME=$(readJsonProp "$PROJECT_DIR/package.json" "codename")

  curl https://api.github.com/repos/$GH_ORG/ionic/releases > $TMP_DIR/releases.json

  node -e "var releases = require('$TMP_DIR/releases.json'); \
    var release; \
    releases.forEach(function(r) { \
      if (r.tag_name == 'v$VERSION') { \
        release = r.id; \
      } \
    }); \
    require('fs').writeFileSync('$TMP_DIR/RELEASE_ID', release);"
  RELEASE_ID=$(cat $TMP_DIR/RELEASE_ID)

  node -e "require('fs').writeFileSync('$TMP_DIR/github.json', JSON.stringify({ \
      name: \"v$VERSION '$CODENAME'\", \
      body: fs.readFileSync('$TMP_DIR/CHANGELOG_NEW.md').toString() \
    }));"

  curl -X PATCH https://api.github.com/repos/$GH_ORG/ionic/releases/$RELEASE_ID \
    -H "Authorization: token $GH_TOKEN" \
    --data-binary @$TMP_DIR/github.json
}

function discourse {
  
}

source $(dirname $0)/../utils.inc
