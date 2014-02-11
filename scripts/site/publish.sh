
echo "#################################"
echo "#### Update Site #################"
echo "#################################"

ARG_DEFS=( )

function init {
  PROJECT_DIR=$SCRIPT_DIR/../..
  BUILD_DIR=$SCRIPT_DIR/../../dist

  IONIC_SITE_DIR=$SCRIPT_DIR/../../tmp/ionic-site
  rm -rf $IONIC_SITE_DIR
  mkdir -p $IONIC_SITE_DIR
}

function run {
  VERSION=$(readJsonProp "$BUILD_DIR/version.json" "version")
  CODENAME=$(readJsonProp "$BUILD_DIR/version.json" "codename")
  DATE=$(readJsonProp "$BUILD_DIR/version.json" "date")

  echo "-- Cloning ionic-site..."
  git clone https://$GH_ORG:$GH_TOKEN@github.com/$GH_ORG/ionic-site.git $IONIC_SITE_DIR \
    --branch gh-pages

  cd $IONIC_SITE_DIR

  $(replaceInFile "_config.yml" "latest_download:.*$" "latest_download: http:\/\/code.ionicframework.com\/$VERSION\/ionic-v$VERSION.zip")
  $(replaceInFile "_config.yml" "latest_version:.*$" "latest_version: $VERSION \"$CODENAME\"")
  $(replaceInFile "_config.yml" "latest_release_date:.*$" "latest_release_date: $DATE")

  git add -A
  git commit -am "release: $VERSION"

  git push -q origin gh-pages

  echo "-- Published ionic-site to v$VERSION successfully!"
}

source $(dirname $0)/../utils.inc
