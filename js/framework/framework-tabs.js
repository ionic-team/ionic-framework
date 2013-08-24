(function(window, document, framework) {
  framework.Tabs = function() {}

  framework.Tabs.prototype._TAB_ITEM_CLASS = 'tab-item';

  framework.Tabs.prototype._onTouchStart = function(event) {
    console.log('Touch start!', event);
    if(event.target && event.target.parentNode.classList.contains(this._TAB_ITEM_CLASS)) {
      event.target.classList.add('active');
    }
  };
  framework.Tabs.prototype._onTouchEnd = function(event) {
    console.log('Touch end!', event);
    if(event.target && event.target.parentNode.classList.contains(this._TAB_ITEM_CLASS)) {
      event.target.classList.remove('active');
    }
  };

  document.addEventListener('mousedown', framework.Tabs.prototype._onTouchStart);
  document.addEventListener('touchstart', framework.Tabs.prototype._onTouchStart);
  document.addEventListener('touchend', framework.Tabs.prototype._onTouchEnd);

})(this, document, this.FM = this.FM || {});
