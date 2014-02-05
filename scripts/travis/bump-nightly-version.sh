
echo "###########################################"
echo "# Writing nightly version in package.json #"
echo "###########################################"

ARG_DEFS=(
)

function run {

  cd ../..
  echo $PWD

  VERSION=$(readJsonProp "package.json" "version")

  # If no travis build number (if this is a test-run on local machine),
  # just generate a test number
  if [ -z "$TRAVIS_BUILD_NUMBER" ]; then
    TRAVIS_BUILD_NUMBER=1
  fi

  # 7-byte sha for this commit
  SHA=$(git rev-parse HEAD | head -c 7)

  NEW_VERSION="$VERSION-$TRAVIS_BUILD_NUMBER-$SHA"

  replaceJsonProp "package.json" "version" "$NEW_VERSION"

  echo "-- Build version is $NEW_VERSION."
}

source $(dirname $0)/../utils.inc
