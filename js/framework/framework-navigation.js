(function(window, document, location, framework) {

  var  
  x;

  // Add listeners to each link in the document
  framework.addLinkListeners = function() {
    for(x = 0; x < document.links.length; x++) {
      document.links[x].addEventListener('click', linkClick, false);
    }
  }

  // Remove listeners to each link in the document
  framework.removeLinkListeners = function() {
    for(x = 0; x < document.links.length; x++) {
      document.links[x].removeEventListener('click', linkClick, false);
    }
  }

  // A link has been clicked
  function linkClick(e) {
    var
    target = e.target,
    href = target.getAttribute("href");

    // data-previous="true"
    // shortcut if they just want to go to the previous page
    if(target.dataset.previous === "true") {
      window.history.back();
      return preventDefault(e);
    }

    // if they clicked a link while scrolling don't nav to it
    if(framework.isScrolling || href === "#") {
      return preventDefault(e);
    }

    // only intercept the nav click if they're going to the same domain
    if (location.protocol === target.protocol && location.host === target.host) {
      // this link is an anchor to the same page
      if(href.indexOf("#") === 0) {
        hashLinkClick(target, href);
      } else {
        pageLinkClick(target, href);
      }
      return preventDefault(e);
    }
  }

  // they are navigating to another URL within the same domain
  function pageLinkClick(target, href) {
    console.log("pageLinkClick, get:", href);
  }

  // they are navigation to an anchor within the same page
  function hashLinkClick(target, href) {
    console.log("hashLinkClick, get:", href);
  }

  function touchEnd(e) {
    framework.trigger("touchEnd");
  }

  function popstate(e) {
    
  }

  function preventDefault(e) {
    e.preventDefault();
    return false;
  }

  framework.on("ready", function(){
    // DOM is ready
    framework.addLinkListeners();
  });

  window.addEventListener('touchstart', function () { framework.isScrolling = false; });
  window.addEventListener('touchmove', function () { framework.isScrolling = true; })
  window.addEventListener('touchend', touchEnd);
  window.addEventListener('popstate', popstate);

})(this, document, location, this.FM = this.FM || {});