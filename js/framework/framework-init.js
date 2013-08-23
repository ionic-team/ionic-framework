(function(window, document, $) {

  $.init = function() {
    if(!$._init) {
      $._init = true;
      console.log("Framwork init!");
    }
  };

  if ( document.readyState === "complete" ) {
    setTimeout( $.init, 1 );
  } else {
    if ( document.addEventListener ) {
      document.addEventListener( "DOMContentLoaded", $.init, false );
      window.addEventListener( "load", $.init, false );
    } else if ( document.attachEvent ) {
      document.attachEvent( "onreadystatechange", $.init );
      window.attachEvent( "onload", $.init );
    }
  }

})(this, document, this.FW || {});