(function(window, document, ion) {

  function initTransitions(e) {
    var data = e.detail.data;

    // build a new main element to hold the new html
    var newMainElement = document.createElement("main");
    newMainElement.innerHTML = data.main;

    // get the old main element, which will be the first one
    var oldMainElement = document.querySelector("main");

    // decide how to do the page transition
    if(data.transition === "slide-from-left") {
      slideStart(newMainElement, oldMainElement, "left");
    } else {
      // No animation. Nothing fancy here
      noTransition(newMainElement, oldMainElement, data);
    }
  }
  
  function noTransition(newMainElement, oldMainElement, data) {
    // entirely replace the old element, no transition
    oldMainElement.parentNode.replaceChild(newMainElement, oldMainElement);
    ion.trigger("pagecreate", {
      url: data.url,
      title: data.title
    });
    ion.trigger("pageview");
  }
  
  function slideStart(newMainElement, oldMainElement, fromDirection) {
    // copy what the main element currently looks like into a document fragment
    // make all the changes to the document fragment, then replace the 
    // old main with the two new ones. Both the old and new main will be 
    // in the DOM, but their CSS classes will do the transitioning for us
  }

  ion.on("pageloaded", initTransitions);

})(this, document, ion = this.ion || {});
