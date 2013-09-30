
(function(ionic) {

  ionic.views.Toggle = function(opts) {
    this.el = opts.el;
    this.checkbox = opts.checkbox;
    this.track = opts.track;
    this.handle = opts.handle;

    // remember that this element, and all its children are apart of a component
    // and assign the component instance to each element so the lookups
    // only has to go through this process just once
    this.el.isComponent = true;
    this.track.component = this;
    this.track.isComponent = true;
    this.handle.component = this;
    this.handle.isComponent = true;

    // ensure the handle is draggable
    this.handle.draggable = true;
  };

  ionic.views.Toggle.prototype = {

    tap: function(e) {
      e.stopPropa
      return false;
    },

    val: function(value) {
      if(value === true || value === false) {
        this.checkbox.checked = value;
      }
      return this.checkbox.checked;
    }

  };

})(ionic);
