# Copy core dist
rm -rf node_modules/@ionic/core/dist node_modules/@ionic/core/loader
cp -a ../../core/dist node_modules/@ionic/core/dist
cp -a ../../core/loader node_modules/@ionic/core/loader
cp -a ../../core/package.json node_modules/@ionic/core/package.json

# Copy ionicons
rm -rf node_modules/ionicons
cp -a ../../core/node_modules/ionicons node_modules/ionicons
