(function(ionic) {
'use strict';

  ionic.views.HeaderBar = ionic.views.View.inherit({
    initialize: function(opts) {
      this.el = opts.el;

      this._titleEl = this.el.querySelector('.title');
    },
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
  });

})(ionic);
