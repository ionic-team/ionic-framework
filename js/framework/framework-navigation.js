(function(window, document, location, framework) {

  var  
  x, 
  y,
  link,
  element;

  // Add listeners to each link in the document
  function addNavListeners() {
    for(x = 0; x < document.links.length; x++) {
      link = document.links[x];
      // double check we didnt already add this event
      if(!link._hasClick) {
        link.addEventListener('click', linkClick, false);
        link._hasClick = true;
      }
    }
  }

  // Remove listeners from the links in the inactive page element
  function removePages(e) {
    var removeElements = document.body.getElementsByClassName("remove-element");

    for(x = 0; x < removeElements.length; x++) {
      element = removeElements[x];
      links = element.querySelectorAll("a");
      for(y = 0; y < links.length; y++) {
        links[y].removeEventListener('click', linkClick, false);
      }

      element.parentNode.removeChild(element);
    }
  }

  var _init = false;
  function locationChange(e) {
    if(!_init) {
      _init = true;
      return;
    }

    requestData({
      url: location.href,
      success: successPageLoad,
      fail: failedPageLoad
    });
  }

  // A link has been clicked
  function linkClick(e) {

    // if they clicked a link while scrolling don't nav to it
    if(framework.isScrolling) {
      e.preventDefault();
      return false;
    }

    // data-history-go="-1"
    // shortcut if they just want to use window.history.go()
    if(e.currentTarget.dataset.historyGo) {
      window.history.go( parseInt(e.currentTarget.dataset.historyGo, 10) );
      e.preventDefault();
      return false;
    }

    // only intercept the nav click if they're going to the same domain or page
    if (location.protocol === e.currentTarget.protocol && location.host === e.currentTarget.host) {
      
      // trigger the event that a new page should be shown
      framework.trigger("pageinit", e.currentTarget.href);

      // decide how to handle this click depending on the href
      if(e.currentTarget.getAttribute("href").indexOf("#") === 0) {
        // this click is going to another element within this same page
        

      } else {
        // this click is going to another page in the same domain
        requestData({
          url: e.currentTarget.href,
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

  function requestData(options) {
    framework.isRequesting = true;
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
    framework.isRequesting = false;
    framework.trigger("pageloaded", {
      data: parseXHR(xhr, options)
    });
  }

  function failedPageLoad(xhr, options) {
    framework.isRequesting = false;
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

  // after a page has been added to the DOM
  framework.on("ready", addNavListeners);
  framework.on("pagecreate", addNavListeners);

  // before a page is about to be removed from the DOM
  framework.on("pageremove", removePages);

  // listen to when the location changes
  framework.on("popstate", locationChange);
  

})(this, document, location, FM = this.FM || {});