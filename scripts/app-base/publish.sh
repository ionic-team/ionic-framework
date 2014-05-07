
echo "#########################"
echo "# Update ionic-app-base #"
echo "#########################"

ARG_DEFS=(
  "--version=(.*)"
)

function init {
  PROJECT_DIR=$SCRIPT_DIR/../..
  TMP_DIR=$PROJECT_DIR/tmp
  BUILD_DIR=$PROJECT_DIR/dist

  APPBASE_DIR=$TMP_DIR/app-base
  rm -rf $APPBASE_DIR
  mkdir -p $APPBASE_DIR
}

function run {
  cd ../..

  rm -rf $APPBASE_DIR
  mkdir -p $APPBASE_DIR

  echo "-- Cloning ionic-app-base..."
  git clone \
    https://$GH_ORG:$GH_TOKEN@github.com/$GH_ORG/ionic-app-base.git \
    $APPBASE_DIR \
    --depth=10

  cd $APPBASE_DIR

  echo "-- Updating files..."
  rm -rf $APPBASE_DIR/www/lib/ionic
  mkdir -p $APPBASE_DIR/www/lib/ionic

  cp -Rf $BUILD_DIR/* $APPBASE_DIR/www/lib/ionic

  mkdir -p $APPBASE_DIR/www/lib/ionic/scss
  cp -Rf $PROJECT_DIR/scss/* $APPBASE_DIR/www/lib/ionic/scss

  git add -A
  git commit -am "release: update ionic to v$VERSION"
  git push -q origin master

  echo "-- ionic-app-base files updated to v$VERSION successfully!"
}

source $(dirname $0)/../utils.inc
