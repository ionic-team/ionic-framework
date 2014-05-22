
# adapted from Angular's bower script
# Script for updating the Ionic bower repos from current build

echo "#################################"
echo "#### Update bower ###############"
echo "#################################"

ARG_DEFS=(
  "--version=(.*)"
  "--codename=(.*)"
)

function init {
  BOWER_DIR=$IONIC_DIST_DIR/ionic-bower

  echo "-- Cloning ionic-bower..."

  rm -rf $BOWER_DIR
  mkdir -p $BOWER_DIR
  git clone https://driftyco:$GH_TOKEN@github.com/driftyco/ionic-bower.git \
     $BOWER_DIR \
     --depth=1
}

function run {

  # move the files from the build
  echo "-- Putting build files in ionic-bower..."

  cd $BOWER_DIR
  cp -Rf $IONIC_BUILD_DIR/* $BOWER_DIR
  cp -Rf $IONIC_SCSS_DIR $BOWER_DIR

  # Angular dependencies are managed by bower, don't include them
  rm -rf $BOWER_DIR/{js/angular*,CHANGELOG*,version.json}

  echo "-- Copying bower.json from project_dir and renaming main files"
  node -p "var b = require('$IONIC_DIR/bower.json'); \
    delete b.ignore; \
    b.main = b.main.map(function(s) { return s.replace(/^release\//,''); }); \
    JSON.stringify(b,null,2);" \
    > $BOWER_DIR/bower.json

  echo "-- Updating version in ionic-bower to $VERSION"
  replaceJsonProp "bower.json" "version" "$VERSION"

  echo "-- Updating codename in ionic-bower to $CODENAME"
  replaceJsonProp "bower.json" "codename" "$CODENAME"

  echo "-- Committing and tagging ionic-bower"
  git add -A
  git commit -m "release: v$VERSION"
  git tag -f v$VERSION

  echo "-- Pushing ionic-bower"
  cd $BOWER_DIR

  git push -q --tags origin master

  echo "-- Published ionic-bower to v$VERSION successfully!"

  # Go back to the script to make things 'safe'
  cd $SCRIPT_DIR
}

source $(dirname $0)/../utils.inc
