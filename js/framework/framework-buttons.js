(function(window, document, framework) {
  framework.Button = function() {}

  // Process an the touchstart event and if this is a button,
  // add the .active class so Android will show depressed
  // button states.
  framework.Button.prototype._onTouchStart = function(event) {
    console.log('Touch start!', event);
    if(event.target && event.target.classList.contains('button')) {
      event.target.classList.add('active');
    }
  };


  // Remove any active state on touch end/cancel/etc.
  framework.Button.prototype._onTouchEnd = function(event) {
    console.log('Touch end!', event);
    if(event.target && event.target.classList.contains('button')) {
      event.target.classList.remove('active');
    }
  };

  document.addEventListener('touchstart', framework.Button.prototype._onTouchStart);
  document.addEventListener('touchend', framework.Button.prototype._onTouchEnd);
  document.addEventListener('touchcancel', framework.Button.prototype._onTouchEnd);

})(this, document, this.FM = this.FM || {});
