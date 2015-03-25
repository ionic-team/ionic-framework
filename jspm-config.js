System.config({
  'paths': {
    '*': '*.js',
    'angular2/*': '/dist/lib/angular2/*.js'
  },
  'traceurOptions': {
    'sourceMaps': true,
    'annotations': true,
    'types': true,
    'script': false,
    'memberVariables': true,
    'modules': 'instantiate'
  }
});

System.config({
  'map': {
    'hammer': '/node_modules/hammerjs/hammer',
    'rx': '/node_modules/rx',
    'ionic2': '/src',
  }
});

