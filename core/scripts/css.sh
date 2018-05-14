#/bin/sh

# TODO: refactor to JS, it was easier to get Poc with a bash script

# Transpile SCSS to CSS
node-sass --output ./dist/css ./src/css/

# Minify and optimize CSS
cleancss -O2 -o ./dist/css/basics.min.css ./dist/css/basics.css
cleancss -O2 -o ./dist/css/recommended.min.css ./dist/css/recommended.css
cleancss -O2 -o ./dist/css/advanced.min.css ./dist/css/advanced.css
