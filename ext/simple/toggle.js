
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