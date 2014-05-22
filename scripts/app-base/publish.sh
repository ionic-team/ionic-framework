
echo "#########################"
echo "# Update ionic-app-base #"
echo "#########################"

ARG_DEFS=(
  "--version=(.*)"
)

function init {
  APPBASE_DIR=$IONIC_DIST_DIR/app-base
  APPBASE_LIB_DIR=$APPBASE_DIR/www/lib/ionic

  echo "-- Cloning ionic-app-base..."

  rm -rf $APPBASE_DIR
  mkdir -p $APPBASE_DIR
  git clone \
    https://driftyco:$GH_TOKEN@github.com/driftyco/ionic-app-base.git \
    $APPBASE_DIR \
    --depth=1

}

function run {
  cd ../..

  cd $APPBASE_DIR

  echo "-- Updating files..."

  rm -rf $APPBASE_LIB_DIR
  mkdir -p $APPBASE_LIB_DIR

  cp -Rf $IONIC_BUILD_DIR/* $APPBASE_LIB_DIR
  cp -Rf $IONIC_SCSS_DIR $APPBASE_LIB_DIR

  replaceJsonProp "$APPBASE_DIR/bower.json" "ionic" "driftyco\/ionic-bower#$VERSION"

  git add -A
  git commit -am "release: update ionic to v$VERSION"
  git push -q origin master

  echo "-- ionic-app-base files updated to v$VERSION successfully!"
}

source $(dirname $0)/../utils.inc
