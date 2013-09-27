(function(ionic) {

ionic.views.HeaderBar = function(opts) {
  this.el = opts.el;

  this._titleEl = this.el.querySelector('.title');
};

ionic.views.NavBar.prototype = {
  resizeTitle: function() {
    var e,
      children = this.el.children,
      index = Array.prototype.indexOf.call(children, this.el);

    for(var i = 0; i < index; i++) {
      e = children[i];
    }
  }
};
})(window.ionic);
