(function(window, document, framework) {

  framework.get = function(id) {
    return document.getElementById(id);
  };

  framework.getByClass = function(classname) {
    return document.getElementByClassName(classname);
  };

  framework.getByTag = function(tagName) {
    return document.getElementsByTagName(tagName);
  };

  framework.trigger = function(type, data) {
    window.dispatchEvent( new CustomEvent(type, data) );
  };

  framework.on = function(type, callback, element) {
    var e = element || window;
    e.addEventListener(type, callback);
  };

})(this, document, this.FM = this.FM || {});