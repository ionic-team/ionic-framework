
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

  window.Ionic = window.Ionic || {};
  window.Ionic.config = window.Ionic.config || {};

  window.addEventListener('appload', () => {
    window.testAppLoaded = true;
  })
})();
