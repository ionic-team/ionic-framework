
(function(){

  var ionicImport = System.import('ionic/components/app/app');

  function importApp(module) {
    if (module) {
      var appImport = System.import(module);
      ionicImport.then(function(ionic) {
        appImport.then(function(app) {
          ionic.load(app);
        });
      });
    }
  }

  var ele = document.querySelectorAll('[module]');
  for (var i = 0; i < ele.length; i++) {
    importApp(ele[i].getAttribute('module'));
  }

})();
