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
 * - `ionic:theme`: Set to `ionic`, `ios`, `md` or `base` to load a specific 
 * theme. Defaults to the mode, then `md`.
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
   * This can be `ionic`, `ios`, `md`, or `base`. Defaults to the mode, as in
   * the app, then to `md`.
   * `base` loads only the base tokens, with no component tokens, to show
   * how migrated components render without a theme.
   */
  const themeQuery = window.location.search.match(/ionic:theme=([a-z0-9]+)/i);
  const themeHash = window.location.hash.match(/ionic:theme=([a-z0-9]+)/i);
  const themeAttr = document.documentElement.getAttribute('theme');
  const modeQuery = window.location.search.match(/ionic:mode=([a-z]+)/i);
  const modeHash = window.location.hash.match(/ionic:mode=([a-z]+)/i);
  const modeAttr = document.documentElement.getAttribute('mode');
  const modeName = modeQuery?.[1] || modeHash?.[1] || modeAttr;
  const themeName = themeQuery?.[1] || themeHash?.[1] || themeAttr || modeName || DEFAULT_THEME;

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
  const validThemes = ['ionic', 'ios', 'md', 'base'];
  let themeReady = Promise.resolve();
  if (themeName && validThemes.includes(themeName)) {
    // Store existing theme set from the app initialization
    const customTheme = window.Ionic?.config?.customTheme;
    // Load the default tokens for the theme
    const themeLoaded = import(`/themes/${themeName}/default.tokens.js`).then((defaultTokens) =>
      buildTheme(defaultTokens.defaultTheme, customTheme, paletteName)
    );

    /*
     * Components read the theme's config when they first render, and don't
     * render again when it changes. The tokens load asynchronously, so
     * `initialize()` in ionic-global.ts can run before they arrive. Holding
     * back the definitions of Ionic's components until the theme's config is
     * set means none of them renders without it.
     *
     * Only pages with the theme in the URL query need this: `setContent`
     * sets its own theme before Ionic loads.
     */
    let definitionsReady = Promise.resolve();
    if (themeQuery) {
      definitionsReady = themeLoaded.then(setThemeConfig).catch(() => {});
      holdComponentDefinitions(definitionsReady);
    }

    /*
     * While the definitions are held no component connects, so Stencil fires
     * `appload` from its 30ms fallback before any component has loaded. Wait
     * for the held components to load before the page counts as ready.
     */
    themeReady = Promise.all([loadThemeTokens(themeName, themeLoaded), definitionsReady])
      .then(() =>
        Promise.all(
          [...document.querySelectorAll('*')]
            .filter((el) => el.tagName.startsWith('ION-'))
            .map((el) => el.componentOnReady?.())
        )
      )
      .finally(() => {
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
  function buildTheme(tokensTheme, customTheme, paletteName) {
    let theme = tokensTheme;
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

    return theme;
  }

  /*
   * Sets the theme's config before any component renders. Before `initialize()`
   * runs, the stashed theme is merged by `initialize()` itself. After it runs,
   * the theme's global keys, such as `rippleEffect`, are set the same way
   * `initialize()` sets them.
   */
  function setThemeConfig(theme) {
    window.Ionic = window.Ionic || {};
    window.Ionic.config = window.Ionic.config || {};

    const config = window.Ionic.config;
    if (!config.set) {
      config.customTheme = theme;
      return;
    }

    config.set('customTheme', theme);

    const { components, ...globalConfig } = theme.config || {};
    Object.entries(globalConfig).forEach(([key, value]) => {
      if (value !== null && typeof value === 'object') {
        config.set(key, { ...config.get(key, {}), ...value });
      } else {
        config.set(key, value);
      }
    });
  }

  /*
   * Defers defining Ionic's components until `ready` settles. Elements already
   * on the page upgrade and render once they are defined.
   */
  function holdComponentDefinitions(ready) {
    const define = customElements.define.bind(customElements);
    const held = [];
    let released = false;

    customElements.define = (name, constructor, options) => {
      if (released || !name.startsWith('ion-')) {
        define(name, constructor, options);
        return;
      }

      held.push([name, constructor, options]);
    };

    ready.finally(() => {
      released = true;

      /**
       * Defining each component on its own connects its elements in
       * definition order, so `ion-label` can render before the `ion-item`
       * around it and miss the item's color. Elements outside the document
       * don't upgrade, so moving the page out while defining connects them
       * in document order when it's put back, parents first.
       */
      const { body } = document;
      if (!body) {
        held.forEach((args) => define(...args));
        return;
      }

      const page = document.createDocumentFragment();
      page.append(...body.childNodes);
      held.forEach((args) => define(...args));
      body.append(page);
    });
  }

  // TODO(FW-6750): Determine if this function can be removed once the theme tokens can be imported directly into the test pages
  async function loadThemeTokens(themeName, themeLoaded) {
    try {
      const theme = await themeLoaded;

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

  /*
   * Freezes the ripple of every element on the page that has the `ion-activated` class
   * and renders an `ion-ripple-effect`, so screenshots show the full pressed state.
   * The class alone leaves out the ripple, which only appears on a real press.
   */
  async function freezeRipples() {
    const elements = [...document.querySelectorAll('.ion-activated')];

    await Promise.all(
      elements.map(async (el) => {
        await el.componentOnReady?.();

        // Skip elements that don't render a ripple, which depends on the `rippleEffect` config
        const ripple = el.shadowRoot?.querySelector('ion-ripple-effect') ?? el.querySelector('ion-ripple-effect');
        if (!ripple) {
          return;
        }

        /*
         * `addRipple` resolves once the ripple reaches its full size. Never calling
         * the remove function it resolves with keeps the ripple on screen.
         */
        const rect = el.getBoundingClientRect();
        await ripple.addRipple(rect.left + rect.width / 2, rect.top + rect.height / 2);
      })
    );
  }

  /*
   * Tracks when the ripples are frozen. Tests wait on this (see the Playwright
   * `goto` helper) so screenshots are not taken while a ripple is still growing.
   */
  window.__ionicTestRipplesFrozen = false;

  Promise.all([whenConfigReady(), themeReady])
    .then(() => freezeRipples())
    .finally(() => {
      window.__ionicTestRipplesFrozen = true;
    });

  window.Ionic = window.Ionic || {};
  window.Ionic.config = window.Ionic.config || {};

  window.addEventListener('appload', () => {
    window.testAppLoaded = true;
  })
})();
