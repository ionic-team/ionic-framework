(function(ionic) {

  ionic.views.List = function(opts) {
    var _this = this;

    this.el = opts.el;

    window.ionic.onGesture('swipeleft', function(e) {
      _this._handleSwipeLeft(e);
    }, this.el);

    window.ionic.onGesture('swiperight', function(e) {
      _this._handleSwipeRight(e);
    }, this.el);
  };

  ionic.views.List.prototype = {
    _handleSwipeLeft: function(e) {
      var item = e.target;
      if(!item.classList.contains('list-item')) {
        return;
      }

      item.classList.add('slide-left');
    },
    _handleSwipeRight: function(e) {
      var item = e.target;
      if(!item.classList.contains('list-item')) {
        return;
      }

      item.classList.remove('slide-left');
    }
  };

})(ionic);
