# Copy angular dist
rm -rf node_modules/@ionic/angular/dist
cp -a ../../dist node_modules/@ionic/angular/dist

# Copy core dist
rm -rf node_modules/@ionic/core/dist
cp -a ../../../core/dist node_modules/@ionic/core/dist

# Copy ionicons
rm -rf node_modules/ionicons
cp -a ../../../core/node_modules/ionicons node_modules/ionicons
