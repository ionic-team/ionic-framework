
(function(document){

  // hairline polyfill
  if (window.devicePixelRatio >= 2) {
    var harlineEle = document.createElement('div');
    harlineEle.style.border = '.5px solid transparent';
    document.body.appendChild(harlineEle);

    if (harlineEle.offsetHeight == 1) {
      document.body.classList.add('hairlines');
    }
    document.body.removeChild(harlineEle);
  }


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

})(document);
