
(function(window, document, ionic) {

  ionic.Components = [];

  ionic.registerComponent = function(instance) {
    ionic.Components.push(instance);
  };

  ionic.component = function(el) {
    if(el) {
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
      // is or is in a registered component
      component = ionic.component(el);
      if(component) {
        component[eventName] && component[eventName](e.gesture.srcEvent);
        return;
      }
      // not sure if this element is a component yet,
      // keep climbing up the tree and check again
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
(function(ionic) {

  ionic.registerComponent({

    isComponent: function(el) {
      // this is a Toggle component if it has a "toggle" classname
      return el.classList.contains("toggle");
    },

    init: function(el) {
      if(el) {

        // check if we've already created a Toggle instance for this element
        if(!el._instance) {

          // find all the required elements that make up a toggle
          var opts = { 
            el: el,
            checkbox: el.querySelector("input[type='checkbox']"),
            track: el.querySelector(".track"),
            handle: el.querySelector(".handle")
          };

          // validate its a well formed toggle with the required pieces
          if(!opts.checkbox || !opts.track || !opts.handle) {
            return;
          }

          // ensure the handle is draggable
          opts.handle.draggable = true;

          // initialize an instance of a Toggle
          el._instance = new ionic.views.Toggle(opts);
        }

        return el._instance;
      }
    }

  });

})(ionic);