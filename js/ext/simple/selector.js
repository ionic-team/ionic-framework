
(function(window, document, ionic) {

  ionic.fn = {
    val: function() {
      var ret, x;
      for(x = 0; x < this.length; x++) {
        ret = this[x].component.val.apply(this[x].component, arguments);
      }
      return ret;
    }
  }

  if (window.jQuery) {
    // if jQuery is present then it should be the default
    jq = window.jQuery;

    // extend the methods which are in ionic.fn and in jQuery.fn
    for(var name in ionic.fn) {
      var jQueryFn = jq.fn[name];
      jq.fn[name] = function() {
        var 
        x,
        ret; // if incase this isn't an ionic component

        for(x = 0; x < this.length; x++) {
          ionic.component( this[x] );
          if( this[x].component ) {
            ret = this[x].component[name].apply(this[x].component, arguments);
          }
        }

        // if this isn't an ionic component, run the usual jQuery fn
        return jQueryFn.apply(this, arguments); 
      }
    }

  } else {
    // jQuery is not already present, so use our 'lil version instead
    jq = {

      init: function(selector, context) {
        context = context || document;
        var 
        x,
        dom = context.querySelectorAll(selector) || [];
        for(x = 0; x < dom.length; x++) {
          ionic.component( dom[x] );
        }
        dom.__proto__ = ionic.fn;
        dom.selector = selector || '';
        return dom;
      }

    };

    $ = function(selector, context) {
      return jq.init(selector, context);
    }
  }

})(this, document, ionic);
