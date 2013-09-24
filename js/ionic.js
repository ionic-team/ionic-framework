window.ionic = {};

// Create namespaces 
ionic.controllers = {};
ionic.views = {};

function initalize() {
  // remove the ready listeners
  document.removeEventListener( "DOMContentLoaded", initalize, false );
  window.removeEventListener( "load", initalize, false );

  /*
  // trigger that the DOM is ready
  ionic.trigger("ready");

  // trigger that the start page is in view
  ionic.trigger("pageview");

  // trigger that the webapp has been initalized
  ionic.trigger("initalized");
  */
}

// When the DOM is ready, initalize the webapp
if ( document.readyState === "complete" ) {
  // DOM is already ready
  setTimeout( initalize );
} else {
  // DOM isn't ready yet, add event listeners
  document.addEventListener( "DOMContentLoaded", initalize, false );
  window.addEventListener( "load", initalize, false );
}
