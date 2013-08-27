

all: release

release:
	@sass -I scss/ scss/framework.scss:dist/framework.css

cordova:
	@cp js/framework/*.js example/cordova/iOS/www/js
	@cp dist/framework.css example/cordova/iOS/www/css

