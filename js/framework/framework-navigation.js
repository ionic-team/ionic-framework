(function(window, document, location, framework) {

  var  
  x,
  el;

  // Add listeners to each link in the document
  function click(e) {
    // an element has been clicked. If its a link its good to go
    // if its not a link then jump up its parents until you find
    // its wrapping link. If you never find a link do nothing.
    if(e.target) {
      el = e.target;
      if(el.tagName === "A") {
        return linkClick(e, el);
      }
      while(el.parentElement) {
        el = el.parentElement;
        if(el.tagName === "A") {
          return linkClick(e, el);
        }
      }
    }
  }

  // A link has been clicked
  function linkClick(e, el) {

    // if they clicked a link while scrolling don't nav to it
    if(framework.isScrolling) {
      e.preventDefault();
      return false;
    }

    // data-history-go="-1"
    // shortcut if they just want to use window.history.go()
    if(el.dataset.historyGo) {
      window.history.go( parseInt(el.dataset.historyGo, 10) );
      e.preventDefault();
      return false;
    }

    // only intercept the nav click if they're going to the same domain or page
    if (location.protocol === el.protocol && location.host === el.host) {
      
      // trigger the event that a new page should be shown
      framework.trigger("pageinit", el.href);

      // decide how to handle this click depending on the href
      if(el.getAttribute("href").indexOf("#") === 0) {
        // this click is going to another element within this same page
        

      } else {
        // this click is going to another page in the same domain
        requestData({
          url: el.href,
          success: successPageLoad,
          fail: failedPageLoad
        });
      }

      // stop the browser itself from continuing on with this click
      // the above code will take care of the navigation
      e.preventDefault();
      return false;
    }
  }

  function locationChange(e) {
    if(!this._initPopstate) {
      this._initPopstate = true;
      return;
    }

    requestData({
      url: location.href,
      success: successPageLoad,
      fail: failedPageLoad
    });
  }

  function requestData(options) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', options.url, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if(xhr.status === 200) {
          options.success(xhr, options);
        } else {
          options.fail(xhr, options);
        }
      }
    };
    xhr.send();
  }

  function successPageLoad(xhr, options) {
    var data = parseXHR(xhr, options);
    framework.trigger("pageloaded", {
      data: data
    });
    history.pushState({}, data.title, data.url);
    document.title = data.title;
  }

  function failedPageLoad(xhr, options) {
    framework.trigger("pageinitfailed", {
      responseText: xhr.responseText,
      responseStatus: xhr.status
    });
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

    // get the title of the page
    tmp = container.querySelector("title");
    if(tmp) {
      data.title = tmp.innerText;
    } else {
      data.title = data.url;
    }

    // get the main content of the page
    tmp = container.querySelector("main");
    if(tmp) {
      data.main = tmp.innerHTML;
    } else {
      // something is wrong with the data, trigger that the page init failed
      framework.trigger("pageinitfailed");
    }

    return data;
  }

  // listen to every click
  document.addEventListener("click", click, false);

  // listen to when the location changes
  framework.on("popstate", locationChange);
  

})(this, document, location, FM = this.FM || {});
