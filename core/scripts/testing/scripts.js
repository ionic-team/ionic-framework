
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
  * The `theme` query param is used to load a specific theme.
  * This can be `ionic`, `ios`, or `md`. Default to `md` for tests.
  */
  const themeQuery = window.location.search.match(/ionic:theme=([a-z0-9]+)/i);
  const themeAttr = document.documentElement.getAttribute('theme');
  const themeName = themeQuery?.[1] || themeAttr || 'md';

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
   * The `palette` query param is used to load a specific palette
   * for the theme. This can be `light`, `dark`, `high-contrast`,
   * or `high-contrast-dark`. Default to `light` for tests.
   */
  const paletteQuery = window.location.search.match(/palette=([a-z]+)/);
  const paletteName = paletteQuery?.[1] || 'light';

  // Load theme tokens if the theme is valid
  const validThemes = ['ionic', 'ios', 'md'];
  if (themeName && validThemes.includes(themeName)) {
    loadThemeTokens(themeName, paletteName);
  } else if(themeName) {
    console.warn(
      `Unsupported theme "${themeName}". Supported themes are: ${validThemes.join(', ')}.`
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

      // Apply the theme tokens to Ionic config
      window.Ionic = window.Ionic || {};
      window.Ionic.config = window.Ionic.config || {};
      window.Ionic.config.customTheme = theme;

      // Re-apply the global theme
      if (window.Ionic.config.get && window.Ionic.config.set) {
        const themeModule = await import('/themes/utils/theme.js');
        themeModule.applyGlobalTheme(theme);
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
