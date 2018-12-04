pushd ../../..

# Build core
pushd core
npm run build
npm link
popd

# Build angular
pushd angular
npm link @ionic/core
npm run build
popd

popd
