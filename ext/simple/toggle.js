
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