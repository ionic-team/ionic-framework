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

    oldMainElement.parentNode.replaceChild(newMainElement, oldMainElement);
    framework.trigger("pagecreate", {
      id: data.id, 
      url: data.url,
      title: data.title
    });

    history.pushState({}, data.title, data.url);

    framework.trigger("pageview");
  }
  
  framework.on("pageloaded", initTransition);

})(this, document, FM = this.FM || {});
