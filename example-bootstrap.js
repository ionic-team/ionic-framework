var exampleReady = function() {
  console.error('Implement exampleReady to bootstrap your app.\n' +
              'For example: `function exampleReady() { System.import("./main"); }`');
};

(function() {

  var loaded = 0;
  var scripts = [
    '/jspm-config.js',
    'https://cdn.rawgit.com/angular/zone.js/v0.4.1/zone.js',
    'https://cdn.rawgit.com/angular/zone.js/v0.4.1/long-stack-trace-zone.js',
    'https://cdn.rawgit.com/robwormald/50b6b855a6ce21af6967/raw/aa9e1c0eed78defd890ccfcc50c4b4648d4d891d/angular2.js'
  ];

  scripts.forEach(function(src) {
    var script = document.createElement('script');
    script.onload = function() {
      if (++loaded == scripts.length) exampleReady();
    };
    document.head.appendChild(script);
    script.src = src;
  });

})();
