
(function(){

  var ionicImport = System.import('ionic/components/app/app');

  function importApp(module) {
    if (module) {
      System.import(module);
    }
  }

  var ele = document.querySelectorAll('[module]');
  for (var i = 0; i < ele.length; i++) {
    importApp(ele[i].getAttribute('module'));
  }

})();
