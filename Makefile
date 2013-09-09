

all: release

release:
	@sass -I scss/ scss/ionic.scss:dist/ionic.css

cordova:
	@cp -R js/ example/cordova/iOS/www/js
	@cp dist/ionic.css example/cordova/iOS/www/css

watch:
	@sass --watch scss/ionic.scss:dist/ionic.css