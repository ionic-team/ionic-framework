(function(ionic) {

  ionic.views.HeaderBar = function(opts) {
    this.el = opts.el;

    this._titleEl = this.el.querySelector('.title');
  };

  ionic.views.HeaderBar.prototype = {
    resizeTitle: function() {
      var e, j, i,
      title,
      titleWidth,
      children = this.el.children;

      for(i = 0, j = children.length; i < j; i++) {
        e = children[i];
        if(/h\d/.test(e.nodeName.toLowerCase())) {
          title = e;
        }
      }

      titleWidth = title.offsetWidth;
    }
  };

})(ionic);
