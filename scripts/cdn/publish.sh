
# Version name is "nightly" or a version number
ARG_DEFS=(
  "--version-name=(.*)"
  "--old-version=(.*)"
)

echo "##### "
echo "##### cdn/publish.sh"
echo "#####"

function init {
  CDN_DIR=$HOME/ionic-code
  ../clone/clone.sh --repository="ionic-code" \
    --depth="1" \
    --directory="$CDN_DIR" \
    --branch="gh-pages"
}

function run {
  cd ../..

  VERSION_DIR=$CDN_DIR/$VERSION_NAME
  VERSION=$(readJsonProp "package.json" "version")

  rm -rf $VERSION_DIR
  mkdir -p $VERSION_DIR

  node_modules/.bin/gulp build --release --dist=$VERSION_DIR
  if [[ "$VERSION_NAME" == "nightly" ]]; then
    node_modules/.bin/gulp changelog --standalone \
      --html=true \
      --subtitle="(changes since $(git describe --tags --abbrev=0))" \
      --dest="$VERSION_DIR/CHANGELOG.html" \
      --from="$(git tag | grep $OLD_VERSION)"
  fi

  echo "-- Generating versions.json..."
  cd $CDN_DIR/builder
  python ./generate.py

  cd $CDN_DIR

  git config --global user.email "hi@ionicframework.com"
  git config --global user.name "Ionitron"

  git add -A
  git commit -am "release: $VERSION ($VERSION_NAME)"

  git push -q origin gh-pages

  echo "-- Published ionic-code v$VERSION successfully!"
}

source $(dirname $0)/../utils.inc
