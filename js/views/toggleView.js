
(function(ionic) {

  ionic.views.Toggle = function(opts) {
    this.el = opts.el;
    this.checkbox = opts.checkbox;
    this.track = opts.track;
    this.handle = opts.handle;
    this.openPercent = -1;

    /*
    // remember that this element, and all its children are apart of a component
    // and assign the component instance to each element so the lookups
    // only has to go through this process just once
    this.el.isComponent = true;
    this.track.component = this;
    this.track.isComponent = true;
    this.handle.component = this;
    this.handle.isComponent = true;
    */
  };

  ionic.views.Toggle.prototype = {

    tap: function(e) {
      this.val( !this.checkbox.checked );
    },

    drag: function(e) {
      var slidePageLeft = this.track.offsetLeft + (this.handle.offsetWidth / 2);
      var slidePageRight = this.track.offsetLeft + this.track.offsetWidth - (this.handle.offsetWidth / 2);

      if(e.pageX >= slidePageRight - 4) {
        this.val(true);
      } else if(e.pageX <= slidePageLeft) {
        this.val(false);
      } else {
        this.setOpenPercent( Math.round( (1 - ((slidePageRight - e.pageX) / (slidePageRight - slidePageLeft) )) * 100) );
      }
    },

    setOpenPercent: function(openPercent) {
      // only make a change if the new open percent has changed
      if(this.openPercent < 0 || (openPercent < (this.openPercent - 3) || openPercent > (this.openPercent + 3) ) ) {
        this.openPercent = openPercent;

        if(openPercent === 0) {
          this.val(false);
        } else if(openPercent === 100) {
          this.val(true);
        } else {
          var openPixel = Math.round( (openPercent / 100) * this.track.offsetWidth - (this.handle.offsetWidth) );
          openPixel = (openPixel < 1 ? 0 : openPixel);
          this.handle.style.webkitTransform = 'translate3d(' + openPixel + 'px,0,0)';
        }
      }
    },

    release: function(e) {
      this.val( this.openPercent >= 50 );
    },

    val: function(value) {
      if(value === true || value === false) {
        if(this.handle.style.webkitTransform !== "") {
          this.handle.style.webkitTransform = "";
        }
        this.checkbox.checked = value;
        this.openPercent = (value ? 100 : 0);
      }
      return this.checkbox.checked;
    }

  };

})(ionic);
