
# adapted from Angular's bower script
# Script for updating the Ionic bower repos from current build

echo "#################################"
echo "#### Update bower ###############"
echo "#################################"

ARG_DEFS=(
)

function init {
  TMP_DIR=$SCRIPT_DIR/../../tmp
  BUILD_DIR=$SCRIPT_DIR/../../dist
  PROJECT_DIR=$SCRIPT_DIR/../..

  BOWER_DIR=$TMP_DIR/ionic-bower
}

function run {

  VERSION=$(readJsonProp "$PROJECT_DIR/package.json" "version")
  CODENAME=$(readJsonProp "$PROJECT_DIR/package.json" "codename")

  rm -rf $BOWER_DIR
  mkdir -p $BOWER_DIR

  echo "-- Cloning ionic-bower..."
  git clone https://$GH_ORG:$GH_TOKEN@github.com/$GH_ORG/ionic-bower.git $BOWER_DIR

  # move the files from the build
  echo "-- Putting build files in ionic-bower..."

  cd $BOWER_DIR
  cp -Rf $BUILD_DIR/* $BOWER_DIR
  cp -Rf $PROJECT_DIR/scss $BOWER_DIR

  # Angular dependencies are managed by bower, don't include them
  rm -rf $BOWER_DIR/js/angular*
  # Remove bundle, dependencies are again managed by bower!
  rm -rf $BOWER_DIR/js/ionic.bundle.*
  rm -rf $BOWER_DIR/version.json # unneeded

  # update bower.json
  # tag each repo
  echo "-- Updating version in ionic-bower to $VERSION"
  replaceJsonProp "bower.json" "version" "$VERSION"

  echo "-- Updating codename in ionic-bower to $CODENAME"
  replaceJsonProp "bower.json" "codename" "$CODENAME"

  echo "-- Committing and tagging ionic-bower"
  git add -A
  git commit -m "release: v$VERSION"
  git tag v$VERSION

  echo "-- Pushing ionic-bower"
  cd $BOWER_DIR

  git push -q --tags origin master

  echo "-- Published ionic-bower to v$VERSION successfully!"

  # Go back to the script to make things 'safe'
  cd $SCRIPT_DIR
}

source $(dirname $0)/../utils.inc
