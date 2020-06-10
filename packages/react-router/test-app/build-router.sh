cd ../../../ionic/ionic/packages/react-router
npm run build
npm pack
cd ../../../../ionictestapps/react/react-router-new
npm i ../../../ionic/ionic/packages/react-router/ionic-react-router-5.1.0.tgz
npm run start
