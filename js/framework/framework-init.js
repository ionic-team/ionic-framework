(function(window, document, framework) {

  // Start initalizing the framework
  function initalize() {
    
    
    framework.trigger("initalized");
  }

  // DOM has completed
  function completed() {
    document.removeEventListener( "DOMContentLoaded", completed, false );
    window.removeEventListener( "load", completed, false );
    framework.trigger("ready");
    initalize();
  }

  // When the DOM is ready, call .ready()
  if ( document.readyState === "complete" ) {
    // DOM is already ready, run .ready() via setTimeout
    setTimeout( completed );
  } else {
    // DOM isn't ready yet, add event listeners for when it is
    document.addEventListener( "DOMContentLoaded", completed, false );
    window.addEventListener( "load", completed, false );
  }

})(this, document, this.FM = this.FM || {});