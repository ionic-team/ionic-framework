
echo "###########################################"
echo "# Writing nightly version in package.json #"
echo "###########################################"

ARG_DEFS=(
)

function run {

  cd ../..

  VERSION=$(readJsonProp "package.json" "version")

  NEW_VERSION="$VERSION-$TRAVIS_BUILD_NUMBER"

  replaceJsonProp "package.json" "version" "$NEW_VERSION"

  echo "-- Build version is $NEW_VERSION."
}

source $(dirname $0)/../utils.inc
