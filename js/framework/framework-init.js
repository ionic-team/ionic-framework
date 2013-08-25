(function(window, document, framework) {

  function initalize() {
    // remove the ready listeners
    document.removeEventListener( "DOMContentLoaded", initalize, false );
    window.removeEventListener( "load", initalize, false );

    // trigger that the DOM is ready
    framework.trigger("ready");

    // ensure that the start page has an id
    var mainElement = document.querySelector("main");
    if(mainElement) {
      if(!mainElement.id || mainElement.id === "") {
        mainElement.id = "pg" + Math.floor( Math.random() * 999999 );
      }

      // remember what the active page's id is
      framework.activePageId = mainElement.id;

      // inform the framework that the start page has been added to the DOM
      framework.trigger("pagecreate", {id: mainElement.id, url: location.href});

      // trigger that the start page is in view
      framework.trigger("pageview");
    }
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

})(this, document, FM = this.FM || {});