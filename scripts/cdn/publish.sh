
echo "#################################"
echo "#### Update CDN #################"
echo "#################################"

# Version label is "nightly" or a version number
ARG_DEFS=(
  "--version-label=(.*)"
)

function init {
  PROJECT_DIR=$SCRIPT_DIR/../..
  BUILD_DIR=$SCRIPT_DIR/../../dist

  IONIC_CODE_DIR=$SCRIPT_DIR/../../tmp/ionic-code
  rm -rf $IONIC_CODE_DIR
  mkdir -p $IONIC_CODE_DIR
}

function run {

  VERSION=$(readJsonProp "$PROJECT_DIR/package.json" "version")
  CODENAME=$(readJsonProp "$PROJECT_DIR/package.json" "codename")

  echo "-- Cloning ionic-code..."
  git clone https://$GH_ORG:$GH_TOKEN@github.com/$GH_ORG/ionic-code.git $IONIC_CODE_DIR \
    --branch gh-pages

  VERSION_DIR=$IONIC_CODE_DIR/$VERSION_LABEL
  rm -rf $VERSION_DIR
  mkdir -p $VERSION_DIR

  cd $VERSION_DIR
  cp -R $BUILD_DIR/* $VERSION_DIR

  echo "-- Generating versions.json..."
  cd $IONIC_CODE_DIR/builder
  python ./generate.py > /dev/null

  cd $IONIC_CODE_DIR
  git add -A
  git commit -am "release: $VERSION ($VERSION_LABEL)"

  git push -q origin gh-pages

  echo "-- Published ionic-code to v$VERSION successfully!"
}

source $(dirname $0)/../utils.inc
