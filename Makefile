

all: release

release:
	@sass -I scss/ scss/framework.scss:dist/framework.css