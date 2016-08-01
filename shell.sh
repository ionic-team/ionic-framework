rm -Rf ./dist && \
./node_modules/.bin/ngc -p ngcConfig.json && \
cp src/components/slides/swiper-widget.es2015.js dist/components/slides/swiper-widget.js && \
cp src/components/slides/swiper-widget.d.ts dist/components/slides/ && \
./node_modules/.bin/ngc -p testNgcConfig.json
