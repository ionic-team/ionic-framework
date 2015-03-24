System.config({
  "paths": {
    "*": "*.js",
    "dist/*": "/dist",
    "node_modules/*": "/node_modules/*",
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
    "hammer": "node_modules/hammerjs/hammer.js",
    "rtts_assert": "dist/lib/rtts_assert",
    "rx": "node_modules/rx",
    "ionic2": "/src",
  }
});

