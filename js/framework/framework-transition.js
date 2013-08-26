(function(window, document, framework) {

  function initTransition(e) {
    var data = e.detail.data;
    displayTransition(data);
  }

  // No animation. Nothing fancy here, just display none to block
  function displayTransition(data) {
    // build a new main element to hold the new data
    var newMainElement = document.createElement("main");
    newMainElement.innerHTML = data.main;

    var oldMainElement = document.querySelector("main");
    oldMainElement.className += " hide remove-element";

    insertPageIntoDom(newMainElement, oldMainElement, data);

    history.pushState({}, data.title, data.url);

    framework.trigger("pageview");
    framework.trigger("pageremove");
  }

  // insert the new main element before the old main element
  function insertPageIntoDom(newMainElement, oldMainElement, data) {
    oldMainElement.parentNode.insertBefore(newMainElement, oldMainElement);

    // inform the framework that a new page has been added to the DOM
    framework.trigger("pagecreate", {
      id: data.id, 
      url: data.url,
      title: data.title
    });
  }

  
  framework.on("pageloaded", initTransition);


})(this, document, FM = this.FM || {});