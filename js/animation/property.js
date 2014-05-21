(function(window) {
  // Namespace
  ionic.Animation = ionic.Animation || {};

  ionic.Animation.Property = function(name, obj, defaultValue) {
    this.name = name;
    this.obj = obj;

    if(defaultValue !== undefined) {
      this.setValue(defaultValue);
    }
  };

  ionic.Animation.Property.prototype = {
    getValue: function() {
      return this.obj[this.name];
    },
    setValue: function(val) {
      this.obj[this.name] = val;
      return val;
    }
  };

})(window);
