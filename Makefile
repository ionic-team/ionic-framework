

all: release

release:
	@sass -I scss/ scss/framework-structure.scss:dist/framework-structure.css
	@sass -I scss/ scss/framework-theme-default.scss:dist/framework-theme-default.css