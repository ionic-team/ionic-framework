(function(window, document, framework) {

  // Start initalizing the framework
  function initalize() {
    
    
    framework.trigger("initalized");
  }

  // DOM has completed
  function completed() {
    // remove any listeners
    document.removeEventListener( "DOMContentLoaded", completed, false );
    window.removeEventListener( "load", completed, false );
    framework.trigger("ready");
    
    // init the framework
    initalize();
  }

  // When the DOM is ready, call completed()
  if ( document.readyState === "complete" ) {
    // DOM is already ready
    setTimeout( completed );
  } else {
    // DOM isn't ready yet, add event listeners
    document.addEventListener( "DOMContentLoaded", completed, false );
    window.addEventListener( "load", completed, false );
  }

})(this, document, this.FM = this.FM || {});