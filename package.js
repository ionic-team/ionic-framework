// package metadata file for Meteor.js
var packageName = 'driftyco:ionic'; // https://atmospherejs.com/driftyco/ionic
var where = 'client'; // where to install: 'client' or 'server'. For both, pass nothing.
var version = '1.3.0';

Package.describe({
  name: packageName,
  version: version,
  summary: 'Ionic Framework official Meteor package',
  git: 'git@github.com:driftyco/ionic.git'
});

Package.onUse(function(api) {
  api.versionsFrom(['METEOR@0.9.0', 'METEOR@1.0']);

  api.use('angular:angular@1.5.3', where);
  api.use('angular:angular-animate@1.5.3', where);
  api.use('angular:angular-sanitize@1.5.3', where);
  api.use('angularui:angular-ui-router@0.2.13_3', where);

  // In case the Meteor project has the `fastclick` package,
  // Load it first and cancel it (to use Ionic's one)
  api.use('urigo:cancel-fastclick@0.0.2', where);

  api.addFiles([
    'release/css/ionic.css',
    'release/js/ionic.js',
    'release/js/ionic-angular.js'
  ], where);

  api.addAssets([
    'release/fonts/ionicons.eot',
    'release/fonts/ionicons.svg',
    'release/fonts/ionicons.ttf',
    'release/fonts/ionicons.woff'
  ], where)
});
