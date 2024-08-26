
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
  * The `ionic` theme uses a different stylesheet than the `iOs` and `md` themes.
  * This is to ensure that the `ionic` theme is loaded when the `ionic:theme=ionic`
  * and makes sure that the snapshot tests are rendered correctly.
  */
  const theme = window.location.search.match(/ionic:theme=([a-z]+)/);
 
  if (theme && theme[1] === 'ionic') {
    const linkTag = document.querySelector('link[href*="css/ionic.bundle.css"]');
    const ionicThemeLinkTag = document.querySelector('link[href*="css/ionic/bundle.ionic.css"]');

    if (!linkTag || ionicThemeLinkTag) {
      return;
    }

    linkTag.setAttribute('href', linkTag.getAttribute('href').replace('ionic.bundle.css', 'ionic/bundle.ionic.css')); 
  }

  window.Ionic = window.Ionic || {};
  window.Ionic.config = window.Ionic.config || {};

  window.addEventListener('appload', () => {
    window.testAppLoaded = true;
  })
})();
