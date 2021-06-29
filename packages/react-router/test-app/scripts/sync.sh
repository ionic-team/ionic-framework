# Copy ionic react dist
rm -rf node_modules/@ionic/react/dist node_modules/@ionic/react/css
cp -a ../../react/dist node_modules/@ionic/react/dist
cp -a ../../react/css node_modules/@ionic/react/css
cp -a ../../react/package.json node_modules/@ionic/react/package.json

# Copy ionic react router dist
rm -rf node_modules/@ionic/react-router/dist
cp -a ../dist node_modules/@ionic/react-router/dist
cp -a ../package.json node_modules/@ionic/react-router/package.json

# Copy core dist
rm -rf node_modules/@ionic/core/dist node_modules/@ionic/core/loader
cp -a ../../../core/dist node_modules/@ionic/core/dist
cp -a ../../../core/loader node_modules/@ionic/core/loader
cp -a ../../../core/package.json node_modules/@ionic/core/package.json

# Copy ionicons
rm -rf node_modules/ionicons
cp -a ../../../core/node_modules/ionicons node_modules/ionicons
