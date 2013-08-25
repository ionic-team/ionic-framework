(function(window, document, framework) {
  framework.List = function() {}

  framework.List.prototype._TAB_ITEM_CLASS = 'tab-item';

  framework.List.prototype._onTouchStart = function(event) {
    console.log('Touch start!', event);
    if(event.target && event.target.parentNode.classList.contains(this._TAB_ITEM_CLASS)) {
      event.target.classList.add('active');
    }
  };
  framework.List.prototype._onTouchEnd = function(event) {
    console.log('Touch end!', event);
    if(event.target && event.target.parentNode.classList.contains(this._TAB_ITEM_CLASS)) {
      event.target.classList.remove('active');
    }
  };

  document.addEventListener('mousedown', framework.List.prototype._onTouchStart);
  document.addEventListener('touchstart', framework.List.prototype._onTouchStart);
  document.addEventListener('touchend', framework.List.prototype._onTouchEnd);

})(this, document, FM = this.FM || {});
