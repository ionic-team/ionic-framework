'use strict';

(function(window, document, framework) {

  // Loop through each element in the DOM and collect up all 
  // the templates it has. A template either has data to supply
  // to others, or it needs data from another template
  function initTemplates() {
    var 
    x,
    el,
    emptyTemplates = [];

    // collect up all the templates currently in the DOM
    for(x=0; x<document.all.length; x++) {
      el = document.all[x];

      if(el.dataset.template && !el._templateSet) {
        // this element is either supplying template
        // data or it needs to be filled with template data

        if(el.innerHTML == "") {
          // this element is requesting to have its innerHTML
          // built from a template already set
          emptyTemplates.push(el);

        } else {
          // this element contains innerHTML which should be used
          // as a template for other elements. Save this template
          // data for future use.

          // Save only in sessionStorage, which maintains a storage area that's 
          // available for the duration of the page session. A page session 
          // lasts for as long as the browser is open and survives over page 
          // reloads and restores. Opening a page in a new tab or window will 
          // cause a new session to be initiated.
          sessionStorage.setItem(el.dataset.template, el.innerHTML);          
        }

        // remember that this is set so we don't bother doing all this 
        // code again for the same element in the future
        el._templateIsSet = true;
      }
    }

    // go through each empty template and build it up with existing template data
    for(x=0; x<emptyTemplates.length; x++) {
      tmp = sessionStorage.getItem("t:" + el.dataset.template);
      if(tmp) {
        // we've got template data, plug it into this element's innerHTML
        emptyTemplates[x].innerHTML = tmp;
      }
    }

  }

  framework.on("pageview", initTemplates);

})(this, document, FM = this.FM || {});
