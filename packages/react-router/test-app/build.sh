# This build file is to help build and install ionic/react into test-app easier, not to actually build test-app
cd ../../react
npm run build
npm pack
cd ../react-router/test-app
npm i ../../react/ionic-react-5.5.0.tgz
npm run start


