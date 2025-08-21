set -e

# Delete old packages
rm -f *.tgz

# Pack @ionic/core
echo "\n📦 Packing @ionic/core..."
npm pack ../../core

# Update package.json with global path for the @ionic/core package
echo "\n⚙️ Updating package.json with global path for @ionic/core..."
CORE_PACKAGE=$(ls ionic-core-*.tgz | head -1)
sed -i "" "s|\"@ionic/core\": \".*\"|\"@ionic/core\": \"file:$(pwd)/$CORE_PACKAGE\"|" package.json

# Install Dependencies
echo "\n🔧 Installing dependencies..."
npm install

# Build the project
echo "\n🔨 Building the project..."
npm run build

# Pack @ionic/react
echo "\n📦 Packing @ionic/react..."
npm pack

echo "\n✅ Packed @ionic/react package!\n   $(pwd)/$(ls ionic-react-*.tgz | head -1)\n"
