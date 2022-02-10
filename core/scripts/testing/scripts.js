
(function() {

  if (window.location.search.indexOf('rtl=true') > -1) {
    document.documentElement.setAttribute('dir', 'rtl');
  }

  if (window.location.search.indexOf('ionic:_testing=true') > -1) {
    const style = document.createElement('style');
    style.innerHTML = `
* {
  caret-color: transparent !important;
}`;
    document.head.appendChild(style);
  }

  window.Ionic = window.Ionic || {};
  window.Ionic.config = window.Ionic.config || {};

  const allReady = () => {
    const promises = [];
    const waitForDidLoad = (promises, elm) => {
      if (elm != null && elm.nodeType === 1) {
        for (let i = 0; i < elm.children.length; i++) {
          const childElm = elm.children[i];
          if (childElm.tagName.includes('-') && typeof childElm.componentOnReady === 'function') {
            promises.push(childElm.componentOnReady());
          }
          waitForDidLoad(promises, childElm);
        }
      }
    };

    waitForDidLoad(promises, window.document.documentElement);

    return Promise.all(promises).catch((e) => console.error(e));
  };

  const waitFrame = () => {
    return new Promise((resolve) => {
      requestAnimationFrame(resolve);
    });
  };


  const stencilReady = () => {
    return allReady()
      .then(() => waitFrame())
      .then(() => allReady())
      .then(() => {
        window.stencilAppLoaded = true;
      });
  };

  if (window.document.readyState === 'complete') {
    stencilReady();
  } else {
    document.addEventListener('readystatechange', function (e) {
      if (e.target.readyState == 'complete') {
        stencilReady();
      }
    });
  }
})();
