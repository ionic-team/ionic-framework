(function(window, document, ion) {
  ion.Button = function() {}

  // Process an the touchstart event and if this is a button,
  // add the .active class so Android will show depressed
  // button states.
  ion.Button.prototype._onTouchStart = function(event) {
    console.log('Touch start!', event);
    if(event.target && event.target.classList.contains('button')) {
      event.target.classList.add('active');
    }
  };


  // Remove any active state on touch end/cancel/etc.
  ion.Button.prototype._onTouchEnd = function(event) {
    console.log('Touch end!', event);
    if(event.target && event.target.classList.contains('button')) {
      event.target.classList.remove('active');
    }

    // TODO: Process the click? Set flag to not process other click events
  };

  document.addEventListener('touchstart', ion.Button.prototype._onTouchStart);
  document.addEventListener('touchend', ion.Button.prototype._onTouchEnd);
  document.addEventListener('touchcancel', ion.Button.prototype._onTouchEnd);

})(this, document, ion = this.ion || {});
