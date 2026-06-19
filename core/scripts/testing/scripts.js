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
const DEFAULT_PALETTE = 'light';

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

  const configDarkMode = window.Ionic?.config?.customTheme?.palette?.dark?.enabled === 'always' ? 'dark' : null;
  const configHighContrastMode = window.Ionic?.config?.customTheme?.palette?.highContrast?.enabled === 'always' ? 'high-contrast' : null;
  const configHighContrastDarkMode = window.Ionic?.config?.customTheme?.palette?.highContrastDark?.enabled === 'always' ? 'high-contrast-dark' : null;
  /**
   * Ensure window.Ionic.config is defined before importing 'testing/scripts'
   * in the test HTML to properly initialize the palette configuration below.
   * 
   * Example:
   * <script>
   *    window.Ionic = { config: { customTheme: { palette: { ... } } } };
   * </script>
   * <script src="testing/scripts.js"></script>
   */
  const configPalette = configDarkMode || configHighContrastMode || configHighContrastDarkMode;
  const paletteQuery = window.location.search.match(/palette=([a-z-]+)/);
  const paletteHash = window.location.hash.match(/palette=([a-z-]+)/);
  const darkClass = document.body?.classList.contains('ion-palette-dark') ? 'dark' : null;
  const highContrastClass = document.body?.classList.contains('ion-palette-high-contrast') ? 'high-contrast' : null;
  const highContrastDarkClass = darkClass && highContrastClass ? 'high-contrast-dark' : null;
  const paletteClass = highContrastDarkClass || highContrastClass || darkClass;

  let paletteName = configPalette || paletteQuery?.[1] || paletteHash?.[1] || paletteClass || DEFAULT_PALETTE;

  if (!validPalettes.includes(paletteName)) {
    console.warn(`Invalid palette name: '${paletteName}'. Falling back to 'light' palette.`);
    paletteName = DEFAULT_PALETTE;
  }

  /*
   * Tracks when the asynchronous theme token loading has finished injecting
   * the component theme CSS. Tests wait on this (see the Playwright `goto`
   * helper) so screenshots are not taken before the themed CSS variables are
   * available, which would render components unstyled.
   */
  window.__ionicTestThemeReady = false;

  // Load theme tokens if the theme is valid
  const validThemes = ['ionic', 'ios', 'md'];
  if (themeName && validThemes.includes(themeName)) {
    loadThemeTokens(themeName, paletteName).finally(() => {
      window.__ionicTestThemeReady = true;
    });
  } else {
    if (themeName) {
      console.warn(
        `Unsupported theme "${themeName}". Supported themes are: ${validThemes.join(', ')}. Defaulting to ${DEFAULT_THEME}.`
      );
    }
    window.__ionicTestThemeReady = true;
  }

  /**
   * Deep merges two objects, with source properties overriding target properties
   * @param target The target object to merge into
   * @param source The source object to merge from
   * @returns The merged object
   */
  // TODO(FW-6750): Remove this once the theme tokens can be imported directly into the test pages
  const deepMerge = (target, source) => {
    const result = { ...target };
  
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = deepMerge(result[key] ?? {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  };

  /*
   * Resolves once the Ionic Config instance (created by `initialize()` in
   * ionic-global.ts) is available. If the app has already loaded we resolve
   * immediately; otherwise we wait for the `appload` event, which fires after
   * `initialize()` has set up the config. This is event-driven rather than
   * polled, so there's no arbitrary timeout. JavaScript's single-threaded
   * execution guarantees `appload` cannot fire between the synchronous check
   * and `addEventListener`, so there is no missed-event race.
   */
  function whenConfigReady() {
    return new Promise((resolve) => {
      if (window.testAppLoaded === true || window.Ionic?.config?.set) {
        resolve();
      } else {
        window.addEventListener('appload', () => resolve(), { once: true });
      }
    });
  }

  // TODO(FW-6750): Determine if this function can be removed once the theme tokens can be imported directly into the test pages
  async function loadThemeTokens(themeName, paletteName) {
    try {
      // Store existing theme set from the app initialization
      const customTheme = window.Ionic?.config?.customTheme;
      // Load the default tokens for the theme
      const defaultTokens = await import(`/themes/${themeName}/default.tokens.js`);
      let theme = defaultTokens.defaultTheme;
      // Merge with existing theme to preserve any customizations
      if (customTheme) {
        theme = deepMerge(theme, customTheme);
      }

      // If a specific palette is requested, modify the palette structure
      // to set the enabled property to 'always'
      // TODO(FW-4004): Implement dark palette
      if (paletteName === 'dark' && theme.palette?.dark) {
        theme.palette.dark.enabled = 'always';
      // TODO(FW-4005): Implement high contrast palette
      } else if (paletteName === 'high-contrast' && theme.palette?.highContrast) {
        theme.palette.highContrast.enabled = 'always';
      // TODO(FW-4005): Implement high contrast dark palette
      } else if (paletteName === 'high-contrast-dark' && theme.palette?.highContrastDark) {
        theme.palette.highContrastDark.enabled = 'always';
      }

      window.Ionic = window.Ionic || {};
      window.Ionic.config = window.Ionic.config || {};

      /**
       * App Initialization or Browser Refresh:
       *
       * If the Config instance doesn't exist yet, stash the theme on the
       * global Ionic object so `initialize()` in ionic-global.ts can merge it
       * into the new Config instance via `config.reset()`.
       */
      if (!window.Ionic.config.set) {
        window.Ionic.config.customTheme = theme;
      }

      /**
       * Wait for the Config instance to be created by `initialize()`, then set
       * the theme and force-inject the global and component CSS ourselves.
       *
       * This avoids a race: if `initialize()` runs before this async import
       * resolves, it applies the base theme (which has no component tokens) and
       * replaces the global Ionic.config, orphaning the stash above. By always
       * applying here once the Config instance exists, the component CSS
       * variables (e.g. --ion-badge-*) are reliably injected regardless of
       * ordering, instead of flaky unstyled renders.
       */
      await whenConfigReady();

      if (window.Ionic?.config?.set) {
        window.Ionic.config.set('customTheme', theme);

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
