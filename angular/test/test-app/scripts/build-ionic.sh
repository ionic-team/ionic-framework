# Build core
pushd ../../..

pushd core
npm run build
npm run link
popd

pushd angular
npm link @ionic/core
npm run build
popd

popd
