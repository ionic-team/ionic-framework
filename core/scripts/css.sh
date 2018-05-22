#/bin/sh

# TODO: refactor to JS, it was easier to get Poc with a bash script

# Transpile SCSS to CSS

INPUT="./src/css/"
OUTPUT="./src/components/app/css"


node-sass --output $OUTPUT $INPUT

# Minify and optimize CSS
cleancss -O2 -o "$OUTPUT/ionic.min.css" "$OUTPUT/ionic.css"
