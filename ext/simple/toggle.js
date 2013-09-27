
(function(window, document, ionic) {

  function initalize() {
    
    ionic.on("swipe", swipe, document.body)
    
  }

  function swipe(e) {
    alert(e.target.tagName)
  }

  ionic.on("domready", initalize);

})(window, document, ionic);