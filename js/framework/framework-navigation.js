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

    // if they clicked a link while scrolling don't nav to it
    if(framework.isScrolling) {
      e.preventDefault();
      return false;
    }

    var
    target = e.target;

    // data-history-go="-1"
    // shortcut if they just want to use window.history.go()
    if(target.dataset.historyGo) {
      window.history.go( parseInt(target.dataset.historyGo, 10) );
      e.preventDefault();
      return false;
    }

    // only intercept the nav click if they're going to the same domain
    if (location.protocol === target.protocol && location.host === target.host) {
      // this link is an anchor to the same page
      if(target.getAttribute("href").indexOf("#") === 0) {
        hashLinkClick(target);
      } else {
        pageLinkClick(target);
      }
      e.preventDefault();
      return false;
    }
  }

  // they are navigating to another URL within the same domain
  function pageLinkClick(target) {
    console.log("pageLinkClick, get:", target.href);

    push({
      url: target.href
    });
  }

  // they are navigation to an anchor within the same page
  function hashLinkClick(target) {
    console.log("hashLinkClick, get:", target.href);
  }

  function touchEnd(e) {
    framework.trigger("touchEnd");
  }

  function popstate(e) {
    
  }

  function push(options) {
    framework.isRequesting = true;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', options.url, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if(xhr.status === 200) {
          successPageLoad(xhr, options);
        } else {
          failedPageLoad(options.url);
        }
      }
    };
    xhr.send();
  }

  function successPageLoad(xhr, options) {
    var data = parseXHR(xhr, options);
    framework.isRequesting = false;
  }

  function failedPageLoad(options) {
    framework.trigger("pageloadfailed");
    framework.isRequesting = false;
  }

  function parseXHR(xhr, options) {
    var 
    container,
    tmp,
    data = {};

    data.url = options.url;

    if (!xhr.responseText) return data;

    container = document.createElement('div');
    container.innerHTML = xhr.responseText;

    tmp = container.querySelector("title");
    if(tmp) {
      data.title = tmp.innerText;
    } else {
      tmp = container.querySelector("h1");
      if(tmp) {
        data.title = tmp.innerText;
      } else {
        data.title = data.url;
      }
    }

    tmp = container.querySelector("main");
    if(tmp) {
      data.main = tmp.innerHTML;
    } else {
      tmp = container.querySelector("body");
      if(tmp) {
        data.main = tmp.innerHTML;
      } else {
        data.main = container.innerHTML;
      }
    }

    return data;
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