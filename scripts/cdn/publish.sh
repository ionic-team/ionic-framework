
echo "#################################"
echo "#### Update CDN #################"
echo "#################################"

# Version name is "nightly" or a version number
ARG_DEFS=(
  "--version=(.*)"
  "--version-name=(.*)"
)

function init {
  CDN_DIR=$IONIC_DIST_DIR/ionic-code

  echo "-- Cloning ionic-code..."

  rm -rf $CDN_DIR
  mkdir -p $CDN_DIR
  git clone https://driftyco:$GH_TOKEN@github.com/driftyco/ionic-code.git \
    $CDN_DIR \
    --branch gh-pages \
    --depth=1
}

function run {

  VERSION_DIR=$CDN_DIR/$VERSION_NAME

  rm -rf $VERSION_DIR
  mkdir -p $VERSION_DIR
  cd $VERSION_DIR

  cp -Rf $IONIC_BUILD_DIR/* $VERSION_DIR

  echo "-- Generating versions.json..."
  cd $CDN_DIR/builder
  python ./generate.py

  cd $CDN_DIR
  git add -A
  git commit -am "release: $VERSION ($VERSION_NAME)"

  git push -q origin gh-pages

  echo "-- Published ionic-code to v$VERSION successfully!"
}

source $(dirname $0)/../utils.inc
