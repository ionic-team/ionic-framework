(function(window, document, framework) {

  
  function transitionBegin(e) {

    var activePageElement = document.getElementById(framework.activePageId);
    if(activePageElement) {

      activePageElement.parentNode.removeChild(activePageElement);
    }

  }

  
  framework.on("pagetransition", transitionBegin);


})(this, document, FM = this.FM || {});