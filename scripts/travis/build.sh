# run this from project root
# source ./scripts/travis/build.sh

export IONIC_DIR=$PWD
export IONIC_SCSS_DIR=$IONIC_DIR/scss
export IONIC_DIST_DIR=$IONIC_DIR/dist
export IONIC_BUILD_DIR=$IONIC_DIR/dist/build

echo IONIC_DIR=$IONIC_DIR
echo IONIC_SCSS_DIR=IONIC_SCSS_DIR=$IONIC_SCSS_DIR
echo IONIC_DIST_DIR=$IONIC_DIST_DIR
echo IONIC_BUILD_DIR=$IONIC_BUILD_DIR

mkdir -p $IONIC_DIST_DIR $IONIC_BUILD_DIR
gulp build --release --dist="$IONIC_BUILD_DIR"

