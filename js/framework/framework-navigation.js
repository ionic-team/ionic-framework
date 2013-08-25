(function(window, document, location, framework) {

  var  
  x,
  link;

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
  function removeInactivePageNavListeners(e) {
    var element = document.getElementById(e.detail.id);
    if(element) {
      links = element.querySelectorAll("a");
      for(x = 0; x < links.length; x++) {
        links[x].removeEventListener('click', linkClick, false);
      }
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

    // only intercept the nav click if they're going to the same domain or page
    if (location.protocol === target.protocol && location.host === target.host) {
      
      // trigger the event that a new page should be shown
      framework.trigger("pageinit", target.href);

      // decide how to handle this click depending on the href
      if(target.getAttribute("href").indexOf("#") === 0) {
        // this click is going to another element within this same page
        hashLinkClick(target);

      } else {
        // this click is going to another page in the same domain
        pageLinkClick(target);

      }

      // stop the browser itself from continuing on with this click
      // the above code will take care of the navigation
      e.preventDefault();
      return false;
    }
  }

  // they are navigating to another URL within the same domain
  function pageLinkClick(target) {

    push({
      url: target.href
    });
  }

  // they are navigation to an anchor within the same page
  function hashLinkClick(target) {
    console.log("hashLinkClick, get:", target.href);
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
    framework.isRequesting = false;
    
    var data = parseXHR(xhr, options);
    insertPageIntoDom(data);

    framework.trigger("pagetransition", {
      newActivePageId: data.id, 
      url: data.url,
      title: data.title
    });

  }

  function failedPageLoad(options) {
    framework.trigger("pageinitfailed");
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
      // get an id for this element
      if(!tmp.id || tmp.id === "") {
        // it doesn't already have an id, so build a random one for it
        data.id = "pg" + Math.floor( Math.random() * 999999 );
      } else {
        // use their existing id
        data.id = tmp.id;
      }
      data.main = tmp.innerHTML;
    }

    return data;
  }

  function insertPageIntoDom(data) {
    if(data && data.main) {
      // get the first main element
      var oldMainElement = document.querySelector("main");

      // build a new main element to hold the new data
      var newMainElement = document.createElement("main");
      newMainElement.id = data.id;
      newMainElement.innerHTML = data.main;

      // insert the new main element before the old main element
      oldMainElement.parentNode.insertBefore(newMainElement, oldMainElement);

      // inform the framework that a new page has been added to the DOM
      framework.trigger("pagecreate", {
        id: data.id, 
        url: data.url,
        title: data.title
      });

    } else {
      // something is wrong with the data, trigger that the page init failed
      framework.trigger("pageinitfailed");
    }
  }

  // after a page has been added to the DOM
  framework.on("pagecreate", addNavListeners);

  // before a page is about to be removed from the DOM
  framework.on("pageremove", removeInactivePageNavListeners);
  

})(this, document, location, FM = this.FM || {});