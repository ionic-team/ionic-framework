

all: release

release:
	@sass -I scss/ scss/framework-with-default-theme.scss:dist/framework-with-theme.css
