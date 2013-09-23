window.ionic = {};

function initalize() {
  // remove the ready listeners
  document.removeEventListener( "DOMContentLoaded", initalize, false );
  window.removeEventListener( "load", initalize, false );

  // trigger that the DOM is ready
  ion.trigger("ready");

  // trigger that the start page is in view
  ion.trigger("pageview");

  // trigger that the webapp has been initalized
  ion.trigger("initalized");
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
