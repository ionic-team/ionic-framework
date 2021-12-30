# Copy ionic vue dist
echo "Copying @ionic/vue"
rm -rf node_modules/@ionic/vue/dist node_modules/@ionic/vue/css
cp -a ../dist node_modules/@ionic/vue/dist
cp -a ../css node_modules/@ionic/vue/css
cp -a ../package.json node_modules/@ionic/vue/package.json

# Copy ionic vue router dist
echo "Copying @ionic/vue-router"
rm -rf node_modules/@ionic/vue-router/dist
cp -a ../../vue-router/dist node_modules/@ionic/vue-router/dist
cp -a ../../vue-router/package.json node_modules/@ionic/vue-router/package.json

echo "Done :)"