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
 * - `ionic:theme`: Set to `ionic`, `ios`, or `md` to load a specific 
 * theme. Defaults to `md`.
 * - `palette`: Set to `light`, `dark`, `high-contrast`, or 
 * `high-contrast-dark` to load a specific palette. Defaults to `light`.
 */

const DEFAULT_THEME = 'md';

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
   * The `theme` param is used to load a specific theme.
   * This can be `ionic`, `ios`, or `md`. Default to `md` for tests.
   */
  const themeQuery = window.location.search.match(/ionic:theme=([a-z0-9]+)/i);
  const themeHash = window.location.hash.match(/ionic:theme=([a-z0-9]+)/i);
  const themeAttr = document.documentElement.getAttribute('theme');
  const themeName = themeQuery?.[1] || themeHash?.[1] || themeAttr || DEFAULT_THEME;

  // TODO(): Remove this when the tokens are working for all components
  // and the themes all use the same bundle
  if ((themeQuery && themeQuery[1] === 'ionic') || themeAttr === 'ionic') {
    const ionicThemeLinkTag = document.querySelector('link[href*="css/ionic/bundle.ionic.css"]');

    if (!ionicThemeLinkTag) {
      const linkTag = document.createElement('link');
      linkTag.setAttribute('rel', 'stylesheet');
      linkTag.setAttribute('type', 'text/css');
      linkTag.setAttribute('href', '/css/ionic/bundle.ionic.css');
      document.head.appendChild(linkTag);
    }

    const defaultThemeLinkTag = document.querySelector('link[href*="css/ionic.bundle.css"]');
    if (defaultThemeLinkTag) {
      defaultThemeLinkTag.remove();
    }
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
    console.warn(`Invalid palette name: '${paletteName}'. Falling back to 'light' palette.`);
    paletteName = 'light';
  }

  // Load theme tokens if the theme is valid
  const validThemes = ['ionic', 'ios', 'md'];
  if (themeName && validThemes.includes(themeName)) {
    loadThemeTokens(themeName, paletteName);
  } else if(themeName) {
    console.warn(
      `Unsupported theme "${themeName}". Supported themes are: ${validThemes.join(', ')}. Defaulting to ${DEFAULT_THEME}.`
    );
  }

  async function loadThemeTokens(themeName, paletteName) {
    try {
      // Load the default tokens for the theme
      const defaultTokens = await import(`/themes/${themeName}/default.tokens.js`);
      const theme = defaultTokens.defaultTheme;

      // If a specific palette is requested, modify the palette structure
      // to set the enabled property to 'always'
      if (paletteName === 'dark' && theme.palette?.dark) {
        theme.palette.dark.enabled = 'always';
      }

      if (window.Ionic?.config?.set) {
        /**
         * Playwright: If the Config instance exists, we must use the
         * `set()` method. This ensures the internal private Map inside
         * the `Config` class is updated with the loaded theme tokens.
         * Without this, components would read 'undefined' or 'base'
         * values from the stale Map when trying to access them through
         * methods like `config.get()`.
         */
        window.Ionic.config.set('customTheme', theme);
      } else {
        /**
         * App Initialization: If the Config instance doesn't exist yet,
         * we attach the theme to the global Ionic object. The `initialize()`
         * method in `ionic-global.ts` will later merge this into the new
         * `Config` instance via `config.reset()`.
         */
        window.Ionic = window.Ionic || {};
        window.Ionic.config = window.Ionic.config || {};
        window.Ionic.config.customTheme = theme;
      }

      /**
       * Re-applying the global theme is critical for Playwright tests.
       * Even if the config is set, the CSS variables for the specific theme 
       * (e.g., md or ios) must be force-injected into the document head to 
       * ensure visual assertions pass correctly.
       */
      if (window.Ionic?.config?.get && window.Ionic?.config?.set) {
        const themeModule = await import('/themes/utils/theme.js');
        themeModule.applyGlobalTheme(theme);
        themeModule.applyComponentsTheme(theme);
      }
    } catch (error) {
      console.error(`Failed to load theme tokens for ${themeName}:`, error);
    }
  }

  window.Ionic = window.Ionic || {};
  window.Ionic.config = window.Ionic.config || {};

  window.addEventListener('appload', () => {
    window.testAppLoaded = true;
  })
})();
