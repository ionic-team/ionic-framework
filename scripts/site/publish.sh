
ARG_DEFS=(
  "[--version-name=(.*)]"
  "--action=(updateConfig|docs)"
)

function init {
  SITE_DIR=$IONIC_DIST_DIR/ionic-site

  echo "-- Cloning ionic-site..."
  rm -rf $SITE_DIR
  mkdir -p $SITE_DIR
  git clone https://driftyco:$GH_TOKEN@github.com/driftyco/ionic-site.git \
    $SITE_DIR \
    --depth=1 \
    --branch=gh-pages
}

function updateConfig {

  echo "#####################################"
  echo "## Updating ionic-site config.yml.. #"
  echo "#####################################"

  VERSION=$(readJsonProp "$IONIC_BUILD_DIR/version.json" "version")
  CODENAME=$(readJsonProp "$IONIC_BUILD_DIR/version.json" "codename")
  DATE=$(readJsonProp "$IONIC_BUILD_DIR/version.json" "date")

  cd $SITE_DIR

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
  cd $IONIC_DIR

  gulp docs --doc-version="$VERSION_NAME"
  gulp docs-index

  VERSION=$(readJsonProp "package.json" "version")

  cd $SITE_DIR

  CHANGES=$(git status --porcelain)

  # if no changes, don't commit
  if [[ "$CHANGES" == "" ]]; then
    echo "-- No changes detected in docs for $VERSION_NAME; docs not updated."
  else
    git add -A
    git commit -am "docs: update for $VERSION"
    git push -q origin gh-pages

    echo "-- Updated docs for $VERSION_NAME succesfully!"
  fi
}

source $(dirname $0)/../utils.inc
