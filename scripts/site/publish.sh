
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
  echo "#################################"
  echo "## Cloning ionic-site repo.... ##"
  echo "#################################"

  rm -rf $IONIC_SITE_DIR
  mkdir -p $IONIC_SITE_DIR

  git clone https://$GH_ORG:$GH_TOKEN@github.com/$GH_ORG/ionic-site.git \
    $IONIC_SITE_DIR \
    --depth=10 \
    --branch=gh-pages
}

function updateConfig {
  echo "#####################################"
  echo "## Cloning ionic-site config.yml... #"
  echo "#####################################"

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
  echo "#####################################"
  echo "## Updating docs for $VERSION_NAME ##"
  echo "#####################################"
  cd $PROJECT_DIR
  gulp docs --doc-version="$VERSION_NAME"

  cd $IONIC_SITE_DIR

  CHANGES=$(git status --porcelain)

  # if no changes, don't commit
  if [[ "$CHANGES" == "" ]]; then
    echo "-- No changes detected in docs for $VERSION_NAME; docs not updated."
  else
    git add -A
    git commit -am "docs: update for $VERSION_NAME"
    git push -q origin gh-pages

    echo "-- Updated docs for $VERSION_NAME succesfully!"
  fi
}

source $(dirname $0)/../utils.inc
