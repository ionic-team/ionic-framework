'use strict';

(function(window, document, framework) {
  
  var x;

  function collectTemplates() {
    for(x=0; x<document.elements.length; x++) {
      
    }
  }

  framework.on("ready", function(){
    framework.collectTemplates();
  });

})(this, document, this.FM = this.FM || {});
