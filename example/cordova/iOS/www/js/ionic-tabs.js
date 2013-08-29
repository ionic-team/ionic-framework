'use strict';

(function(window, document, ion) {
  ion.Tabs = function() {}

  ion.Tabs.prototype._TAB_ITEM_CLASS = 'tab-item';

  ion.Tabs.prototype._onTouchStart = function(event) {
    console.log('Touch start!', event);
    if(event.target && event.target.parentNode.classList.contains(this._TAB_ITEM_CLASS)) {
      event.target.classList.add('active');
    }
  };
  ion.Tabs.prototype._onTouchEnd = function(event) {
    console.log('Touch end!', event);
    if(event.target && event.target.parentNode.classList.contains(this._TAB_ITEM_CLASS)) {
      event.target.classList.remove('active');
    }
  };

  document.addEventListener('mousedown', ion.Tabs.prototype._onTouchStart);
  document.addEventListener('touchstart', ion.Tabs.prototype._onTouchStart);
  document.addEventListener('touchend', ion.Tabs.prototype._onTouchEnd);

})(this, document, ion = this.ion || {});
