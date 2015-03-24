System.config({
  paths: {
    '*': '*.js',
    'github:*': '/jspm_packages/github/*.js',
    'npm:*': '/jspm_packages/npm/*.js'
  },
  traceurOptions: {
    sourceMaps: true,
    annotations: true, // parse annotations
    types: true, // parse types
    script: false, // parse as a module
    memberVariables: true, // parse class fields
    modules: 'instantiate'
  }
});

System.config({
  map: {
    'angular2': '/dist/lib/angular2',
    'rtts_assert': '/dist/lib/rtts_assert',
    'angular/zone.js': 'github:angular/zone.js@0.4.1',
    'events': 'github:jspm/nodelibs-events@0.1.0',
    'hammer': 'github:hammerjs/hammer.js@2.0.4',
    'ionic2': '/src',
    'github:jspm/nodelibs-events@0.1.0': {
      'events-browserify': 'npm:events-browserify@0.0.1'
    },
    'github:jspm/nodelibs-process@0.1.1': {
      'process': 'npm:process@0.10.1'
    },
    'npm:events-browserify@0.0.1': {
      'process': 'github:jspm/nodelibs-process@0.1.1'
    }
  }
});

