System.config({
  "paths": {
    "*": "*.js",
    "dist": "/dist"
  },
  "traceurOptions": {
    "sourceMaps": true,
    "annotations": true,
    "types": true,
    "script": false,
    "memberVariables": true,
    "modules": "instantiate"
  }
});

System.config({
  "map": {
    "angular2": "dist/lib/angular2",
    "hammer": "/node_modules/hammerjs/hammer",
    "ionic2": "/src",
    "rtts_assert": "dist/lib/rtts_assert"
  }
});

