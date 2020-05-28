# Copy angular dist
rm -rf node_modules/@ionic/angular
cp -a ../../dist node_modules/@ionic/angular

# Copy angular server
rm -rf node_modules/@ionic/angular-server
cp -a ../../../packages/angular-server/dist node_modules/@ionic/angular-server

# # Copy core dist
rm -rf node_modules/@ionic/core
mkdir node_modules/@ionic/core
cp -a ../../../core/css node_modules/@ionic/core/css
cp -a ../../../core/dist node_modules/@ionic/core/dist
cp -a ../../../core/hydrate node_modules/@ionic/core/hydrate
cp -a ../../../core/loader node_modules/@ionic/core/loader
cp -a ../../../core/package.json node_modules/@ionic/core/package.json

# # Copy ionicons
rm -rf node_modules/ionicons
cp -a ../../../core/node_modules/ionicons node_modules/ionicons
