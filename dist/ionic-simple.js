
(function(window, document, ionic) {

  ionic.Components = [];

  ionic.registerComponent = function(instance) {
    ionic.Components.push(instance);
  };

  function onTap(e) {
    if (!e.gesture || !e.gesture.srcEvent || !e.gesture.srcEvent.target) return;

    var 
    x,
    e = e.gesture.srcEvent,
    el = e.target,
    component;

    while(el) {
      // climb up the tree looking to see if the target
      // is or is in a registered component
      for(x = 0; x < ionic.Components.length; x++) {
        if( ionic.Components[x].isComponent(el) ) {
          // this element is a component
          // create its view and call it's event handler
          component = ionic.Components[x].create(el);
          component && component.tap && component.tap(e);
          return;
        }
      }

      // not sure if this element is a component yet,
      // keep climbing up the tree and check again
      el = el.parentElement;
    }
  }
  ionic.on("tap", onTap, window);

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
      return el.classList.contains("toggle");
    },

    create: function(el) {
      if(el) {

        if(!el._instance) {
          
         el._instance = new ionic.views.Toggle({ 
            el: el,
            checkbox: el.querySelector("input[type='checkbox']"),
            track: el.querySelector(".track"),
            handle: el.querySelector(".handle")
          });
        }

        return el._instance;
      }
    }

  });

})(ionic);