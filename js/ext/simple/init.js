
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

})(this, document, ionic);