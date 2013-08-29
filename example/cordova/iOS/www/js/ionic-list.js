(function(window, document, ion) {
  ion.List = function() {}

  ion.List.prototype._TAB_ITEM_CLASS = 'tab-item';

  ion.List.prototype._onTouchStart = function(event) {
    console.log('Touch start!', event);
    if(event.target && event.target.parentNode.classList.contains(this._TAB_ITEM_CLASS)) {
      event.target.classList.add('active');
    }
  };
  ion.List.prototype._onTouchEnd = function(event) {
    console.log('Touch end!', event);
    if(event.target && event.target.parentNode.classList.contains(this._TAB_ITEM_CLASS)) {
      event.target.classList.remove('active');
    }
  };

  document.addEventListener('mousedown', ion.List.prototype._onTouchStart);
  document.addEventListener('touchstart', ion.List.prototype._onTouchStart);
  document.addEventListener('touchend', ion.List.prototype._onTouchEnd);

})(this, document, ion = this.ion || {});
