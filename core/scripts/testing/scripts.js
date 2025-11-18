
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

  /**
   * The term `palette` is used to as a param to match the
   * Ionic docs, plus here is already a `ionic:theme` query being
   * used for `md`, `ios`, and `ionic` themes.
   */
  const palette = window.location.search.match(/palette=([a-z]+)/);
  if (palette && palette[1] !== 'light') {
    const linkTag = document.createElement('link');
    linkTag.setAttribute('rel', 'stylesheet');
    linkTag.setAttribute('type', 'text/css');
    linkTag.setAttribute('href', `/css/palettes/${palette[1]}.always.css`);
    document.head.appendChild(linkTag);
  }

  /**
  * The `ionic` theme uses a different stylesheet than the `iOS` and `md` themes.
  * This is to ensure that the `ionic` theme is loaded when the `ionic:theme=ionic`
  * or when the HTML tag has the `theme="ionic"` attribute. This is useful for
  * the snapshot tests, where the `ionic` theme is not loaded by default.
  */
  const themeQuery = window.location.search.match(/ionic:theme=([a-z]+)/);
  const themeAttr = document.documentElement.getAttribute('theme');

  if ((themeQuery && themeQuery[1] === 'ionic') || themeAttr === 'ionic') {
    const ionicThemeLinkTag = document.querySelector('link[href*="css/ionic/bundle.ionic.css"]');

    if (!ionicThemeLinkTag) {
      const linkTag = document.createElement('link');
      linkTag.setAttribute('rel', 'stylesheet');
      linkTag.setAttribute('type', 'text/css');
      linkTag.setAttribute('href', '/css/ionic/bundle.ionic.css');
      document.head.appendChild(linkTag);
    }

    const utilsBundleLinkTag = document.querySelector('link[href*="css/utils.bundle.css"]');
    if (!utilsBundleLinkTag) {
      const linkTag = document.createElement('link');
      linkTag.setAttribute('rel', 'stylesheet');
      linkTag.setAttribute('type', 'text/css');
      linkTag.setAttribute('href', '/css/utils.bundle.css');
      document.head.appendChild(linkTag);
    }

    const defaultThemeLinkTag = document.querySelector('link[href*="css/ionic.bundle.css"]');
    if (defaultThemeLinkTag) {
      defaultThemeLinkTag.remove();
    }
  }

  window.Ionic = window.Ionic || {};
  window.Ionic.config = window.Ionic.config || {};

  window.addEventListener('appload', () => {
    window.testAppLoaded = true;
  })
})();
