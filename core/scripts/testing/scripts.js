/**
 * This script is loaded in testing environments to set up the
 * document based on URL parameters.
 * 
 * Test pages (e.g., `chip/test/basic/index.html`) are set to use
 * URL query parameters.
 * 
 * Playwright test environments (e.g., `chip/test/basic/chip.e2e.ts`)
 * are set based on whether `setContent` or `goto` has been used:
 * - `setContent` uses URL hash parameters. Tests will break if
 * query parameters are used.
 * - `goto` uses URL query parameters.
 * 
 * The following URL parameters are supported:
 * - `rtl`: Set to `true` to enable right-to-left directionality.
 * - `ionic:_testing`: Set to `true` to identify testing environments.
 * - `ionic:mode`: Set to `ios` or `md` to load a specific mode.
 * Defaults to `md`.
 * - `palette`: Set to `light`, `dark`, `high-contrast`, or 
 * `high-contrast-dark` to load a specific palette. Defaults to `light`.
 */

(function() {

  /**
   * The `rtl` param is used to set the directionality of the 
   * document. This can be `true` or `false`.
   */
  const isRTL = window.location.search.indexOf('rtl=true') > -1 || window.location.hash.indexOf('rtl=true') > -1;

  if (isRTL) {
    document.documentElement.setAttribute('dir', 'rtl');
  }

  /**
   * The `ionic:_testing` param is used to identify testing
   * environments.
   */
  const isTestEnv = window.location.search.indexOf('ionic:_testing=true') > -1 || window.location.hash.indexOf('ionic:_testing=true') > -1;

  if (isTestEnv) {
    const style = document.createElement('style');
    style.innerHTML = `
      * {
        caret-color: transparent !important;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * The `palette` param is used to load a specific palette
   * for the theme.
   * The dark class will load the dark palette automatically
   * if no palette is specified through the URL.
   * 
   * Values can be `light`, `dark`, `high-contrast`,
   * or `high-contrast-dark`. Default to `light` for tests.
   */
  const validPalettes = ['light', 'dark', 'high-contrast', 'high-contrast-dark'];
  const paletteQuery = window.location.search.match(/palette=([a-z-]+)/);
  const paletteHash = window.location.hash.match(/palette=([a-z-]+)/);
  const darkClass = document.body?.classList.contains('ion-palette-dark') ? 'dark' : null;
  const highContrastClass = document.body?.classList.contains('ion-palette-high-contrast') ? 'high-contrast' : null;
  const highContrastDarkClass = darkClass && highContrastClass ? 'high-contrast-dark' : null;

  let paletteName = paletteQuery?.[1] || paletteHash?.[1] || highContrastDarkClass || darkClass || highContrastClass || 'light';

  if (!validPalettes.includes(paletteName)) {
    paletteName = 'light';
    console.warn(`Invalid palette name: ${paletteName}. Falling back to 'light' palette.`);
  }

  if (paletteName !== 'light') {
    const linkTag = document.createElement('link');
    linkTag.setAttribute('rel', 'stylesheet');
    linkTag.setAttribute('type', 'text/css');
    linkTag.setAttribute('href', `/css/palettes/${paletteName}.always.css`);
    document.head.appendChild(linkTag);
  }

  window.Ionic = window.Ionic || {};
  window.Ionic.config = window.Ionic.config || {};

  window.addEventListener('appload', () => {
    window.testAppLoaded = true;
  })
})();
