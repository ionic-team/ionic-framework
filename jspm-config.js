System.config({
  "paths": {
    "*": "*.js",
    "github:*": "/jspm_packages/github/*.js"
  },
  "traceurOptions": {
    "annotations": true,
    "types": true,
    "memberVariables": true
  }
});

System.config({
  "map": {
    "angular/zone.js": "github:angular/zone.js@0.4.1",
    "angular2": "github:angular/angular@master/dist/js/prod/es6/angular2",
    "hammer": "github:hammerjs/hammer.js@2.0.4",
    "ionic2": "/src"
  }
});

