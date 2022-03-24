
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

  /**
   * Waits for all child Stencil components
   * to be ready before resolving.
   * This logic is pulled from the Stencil
   * core codebase for testing with Puppeteer:
   * https://github.com/ionic-team/stencil/blob/16b8ea4dabb22024872a38bc58ba1dcf1c7cc25b/src/testing/puppeteer/puppeteer-events.ts#L158-L183
   */
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

  /**
   * Testing solutions can wait for `window.stencilAppLoaded === true`
   * to know when to proceed with the test.
   */
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
