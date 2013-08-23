(function(window, document, framework) {

  framework.init = function() {
    if(!framework._init) {
      framework._init = true;
      console.log("Framwork init!");
    }
  };

  if ( document.readyState === "complete" ) {
    setTimeout( framework.init, 1 );
  } else {
    if ( document.addEventListener ) {
      document.addEventListener( "DOMContentLoaded", framework.init, false );
      window.addEventListener( "load", framework.init, false );
    } else if ( document.attachEvent ) {
      document.attachEvent( "onreadystatechange", framework.init );
      window.attachEvent( "onload", framework.init );
    }
  }

})(this, document, this.FW || {});