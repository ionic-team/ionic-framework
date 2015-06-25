System.config({
  "baseURL": "/",
  "transpiler": "traceur",
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js",
    "ionic/*": "dist/js/ionic.bundle.js",
    "angular2/*": "scripts/resources/angular2.dev.js"
  },
  "bundles": {
    "dist/js/ionic.bundle": [
      "ionic"
    ],
    "scripts/resources/angular2.dev": [
      "angular2"
    ]
  }
});

System.config({
  "map": {
    "babel": "npm:babel-core@5.6.5",
    "traceur": "github:jmcriffey/bower-traceur@0.0.88",
    "traceur-runtime": "github:jmcriffey/bower-traceur-runtime@0.0.88"
  }
});

