(function(ionic) {

ionic.views.HeaderBar = function(opts) {
  this.el = opts.el;

  this._titleEl = this.el.querySelector('.title');
};

ionic.views.NavBar.prototype = {
  resizeTitle: function() {
    var e;
    var j;
    var children = this.el.children;

    var title;
    var titleWidth;

    for(var i = 0; j = children.length; i < j; i++) {
      e = children[i];
      if(/h\d/.test(e.nodeName.toLowerCase())) {
        title = e;
      }
    }

    titleWidth = title.offsetWidth;
  }
};
})(window.ionic);
