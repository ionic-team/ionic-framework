(function(window, document, framework) {
  framework.Tabs = function() {}

  framework.Tabs.prototype._onTouchStart = function(event) {
    console.log('Touch start!', event);
    if(event.target && event.target.classList.contains('button')) {
      event.target.classList.add('active');
    }
  };
  framework.Tabs.prototype._onTouchEnd = function(event) {
    console.log('Touch end!', event);
    if(event.target && event.target.classList.contains('button')) {
      event.target.classList.remove('active');
    }
  };

  document.addEventListener('touchstart', framework.Button.prototype._onTouchStart);
  document.addEventListener('touchend', framework.Button.prototype._onTouchEnd);

})(this, document, this.FM = this.FM || {});
