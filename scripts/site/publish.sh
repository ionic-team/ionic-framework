
echo "#################################"
echo "#### Update Site #################"
echo "#################################"

ARG_DEFS=(
  "[--version-name=(.*)]"
  "--action=(clone|updateConfig|docs)"
)

function init {
  PROJECT_DIR=$SCRIPT_DIR/../..
  BUILD_DIR=$SCRIPT_DIR/../../dist

  IONIC_SITE_DIR=$SCRIPT_DIR/../../tmp/ionic-site
}

function clone {
  rm -rf $IONIC_SITE_DIR
  mkdir -p $IONIC_SITE_DIR

  echo "-- Cloning ionic-site..."
  git clone https://$GH_ORG:$GH_TOKEN@github.com/$GH_ORG/ionic-site.git \
    $IONIC_SITE_DIR \
    --depth=10 \
    --branch=gh-pages
}

function updateConfig {
  VERSION=$(readJsonProp "$BUILD_DIR/version.json" "version")
  CODENAME=$(readJsonProp "$BUILD_DIR/version.json" "codename")
  DATE=$(readJsonProp "$BUILD_DIR/version.json" "date")

  cd $IONIC_SITE_DIR

  $(replaceInFile "_config.yml" "latest_download:.*$" "latest_download: http:\/\/code.ionicframework.com\/$VERSION\/ionic-v$VERSION.zip")
  $(replaceInFile "_config.yml" "latest_version:.*$" "latest_version: $VERSION \"$CODENAME\"")
  $(replaceInFile "_config.yml" "latest_release_date:.*$" "latest_release_date: $DATE")

  git add -A
  git commit -am "release: $VERSION"

  git push -q origin gh-pages

  echo "-- Published ionic-site config to v$VERSION successfully!"
}

# Example: ./scripts/site/publish.sh --action=docs --version-name=nightly
function docs {
  echo "-- Docs Update"
  # cd $PROJECT_DIR
  # gulp docs

  # cd $IONIC_SITE_DIR

  # CHANGES=$(git status --porcelain)

  # # if no changes, don't commit
  # if [[ "$CHANGES" != "" ]]; then
  #   git add -A
  #   git commit -am "docs: update for $VERSION_NAME"
  #   git push -q origin gh-pages

  #   echo "-- Updated docs for $VERSION_NAME succesfully!"
  # else
  #   echo "-- No changes detected in docs for $VERSION_NAME; docs not updated."
  # fi
}

source $(dirname $0)/../utils.inc
