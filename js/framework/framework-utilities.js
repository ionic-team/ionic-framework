(function(window, document, framework) {

  framework.trigger = function(type, data) {
    window.dispatchEvent( new CustomEvent(type, data) );
  };

  framework.on = function(type, callback, element) {
    var e = element || window;
    e.addEventListener(type, callback);
  };

})(this, document, this.FM = this.FM || {});