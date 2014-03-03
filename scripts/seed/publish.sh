
echo "#####################################"
echo "# Update ionic-angular-cordova-seed #"
echo "#####################################"

ARG_DEFS=(
  "--version=(.*)"
)

function init {
  TMP_DIR=$SCRIPT_DIR/../../tmp
  BUILD_DIR=$SCRIPT_DIR/../../dist

  SEED_DIR=$TMP_DIR/seed
  rm -rf $SEED_DIR
  mkdir -p $SEED_DIR
}

function run {
  cd ../..

  rm -rf $SEED_DIR
  mkdir -p $SEED_DIR

  echo "-- Cloning ionic-angular-cordova-seed..."
  git clone \
    https://$GH_ORG:$GH_TOKEN@github.com/$GH_ORG/ionic-angular-cordova-seed.git \
    $SEED_DIR \
    --depth=10

  cd $SEED_DIR

  echo "-- Updating files..."
  cp -Rf $BUILD_DIR/* $SEED_DIR/www/lib/

  git add -A
  git commit -am "release: update ionic to v$VERSION"
  git push -q origin master

  echo "-- ionic-angular-cordova-seed files update to v$VERSION successfully!"
}

source $(dirname $0)/../utils.inc
