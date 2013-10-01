
(function(window, document, ionic) {

  ionic.Components = [];

  ionic.registerComponent = function(instance) {
    ionic.Components.push(instance);
  };

  ionic.component = function(el) {
    if(el) {
      if(el.component) {
        // this element has already been initialized as a component
        return el.component;
      }
      for(var x = 0; x < ionic.Components.length; x++) {
        if( ionic.Components[x].isComponent(el) ) {
          // this element is a component, init its view
          return ionic.Components[x].init(el);
        }
      }
    }
  };

  function componentEvent(eventName, e) {
    if (!e.gesture || !e.gesture.srcEvent || !e.gesture.srcEvent.target) return;

    var 
    component,
    el = e.gesture.srcEvent.target; // get the original source event's target

    while(el) {
      // climb up the tree looking to see if the target
      // is or is in a registered component. If its already
      // been set that its NOT a component don't bother.
      if(el.isComponent !== false) {
        component = ionic.component(el);
        if(component) {
          component[eventName] && component[eventName](e.gesture.srcEvent);
          return;
        }
        // not sure if this element is a component yet,
        // keep climbing up the tree and check again
        // remember that this element is not a component so 
        // it can skip this process in the future
        el.isComponent = false;
      }
      el = el.parentElement;
    }
  }

  function onTap(e) {
    componentEvent("tap", e);
  }
  ionic.on("tap", onTap, window);

  function onDrag(e) {
    componentEvent("drag", e);
  }
  ionic.on("drag", onDrag, window);

  function onRelease(e) {
    componentEvent("release", e);
  }
  ionic.on("release", onRelease, window);


  function initalize() {
    // remove the ready listeners
    document.removeEventListener( "DOMContentLoaded", initalize, false );
    window.removeEventListener( "load", initalize, false );

    // trigger that the DOM is ready
    ionic.trigger("domready");
  }

  // When the DOM is ready, initalize the webapp
  if ( document.readyState === "complete" ) {
    // DOM is already ready
    setTimeout( initalize );
  } else {
    // DOM isn't ready yet, add event listeners
    document.addEventListener( "DOMContentLoaded", initalize, false );
    window.addEventListener( "load", initalize, false );
  }

})(this, document, ionic);;
(function(ionic) {

  ionic.registerComponent({

    name: "listview",

    isComponent: function(element) {
      return false;
    },

    tap: function(e) {

    }

  });

})(ionic);;
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
;
(function(ionic) {

  ionic.registerComponent({

    isComponent: function(el) {
      // this is a Toggle component if it has a "toggle" classname
      return el.classList.contains("toggle");
    },

    init: function(el) {
      if(el) {

        // check if we've already created a Toggle instance for this element
        if(!el.component) {

          // find all the required elements that make up a toggle
          var opts = { 
            el: el,
            checkbox: el.querySelector("input[type='checkbox']"),
            track: el.querySelector(".track"),
            handle: el.querySelector(".handle")
          };

          // validate its a well formed toggle with the required pieces
          if(!opts.checkbox || !opts.track || !opts.handle) return;

          // initialize an instance of a Toggle
          el.component = new ionic.views.Toggle(opts);
        }

        return el.component;
      }
    }

  });

})(ionic);