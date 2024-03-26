export type Mode = 'ios' | 'md' | 'ionic-ios' | 'ionic-md';
export type Direction = 'ltr' | 'rtl';
export type Theme = 'ios' | 'md' | 'ionic';

/**
 * The theme to use for the playwright test.
 *
 * - `light`: The fallback theme values. Theme stylesheet will not be included.
 * - `dark`: The dark theme values.
 * - `high-contrast`: The high contrast light theme values.
 * - `high-contrast-dark`: The high contrast dark theme values.
 */
export type Palette = 'light' | 'dark' | 'high-contrast' | 'high-contrast-dark';

export type TitleFn = (title: string) => string;
export type ScreenshotFn = (fileName: string) => string;

export interface TestConfig {
  direction: Direction;
  palette: Palette;
  mode: Mode;
  theme: Theme;
}

interface TestUtilities {
  title: TitleFn;
  screenshot: ScreenshotFn;
  config: TestConfig;
}

interface TestConfigOption {
  /**
   * The available options to test against.
   * - "ios": Test against iOS theme on iOS mode.
   * - "md": Test against Material Design theme on Material Design mode.
   * - "ionic-ios": Test against Ionic theme on iOS mode.
   * - "ionic-md": Test against Ionic theme on Material Design mode.
   *
   * If unspecified, tests will run against "ios" and "md".
   */
  modes?: Mode[];
  /**
   * The text direction to test against.
   *
   * - "ltr": Test against left-to-right direction.
   * - "rtl": Test against right-to-left direction.
   *
   * If unspecified, tests will run against both directions.
   */
  directions?: Direction[];
  /**
   * The color palette to test against.
   *
   * - "light": Test against light theme.
   * - "dark": Test against dark theme.
   * - "high-contrast": Test against high contrast light theme.
   * - "high-contrast-dark": Test against high contrast dark theme.
   *
   * If unspecified, tests will run against light theme.
   */
  palettes?: Palette[];
}

/**
 * Generates a unique test title based on a base title
 * and a test config. Playwright uses test titles to generate
 * test IDs for the test reports, so it's important that
 * each test title is unique.
 */
const generateTitle = (title: string, config: TestConfig): string => {
  const { direction, palette, mode, theme } = config;

  /**
   * The iOS theme can only be used with the iOS mode,
   * and the MD theme can only be used with the MD mode.
   *
   * This logic enables the fallback behavior for existing tests,
   * where we only tested against a mode, which accounted for both
   * the theme and mode.
   */
  if (theme === 'ios' || theme === 'md') {
    if (palette === 'light') {
      /**
       * Ionic has many existing tests that existed prior to
       * the introduction of theme testing. To maintain backwards
       * compatibility, we will not include the theme in the test
       * title if the theme is set to light.
       */
      return `${title} - ${mode}/${direction}`;
    }
    return `${title} - ${mode}/${direction}/${palette}`;
  }

  return `${title} - ${theme}/${mode}/${direction}/${palette}`;
};

/**
 * Generates a unique filename based on a base filename
 * and a test config.
 */
const generateScreenshotName = (fileName: string, config: TestConfig): string => {
  const { direction, palette, mode, theme } = config;
  /**
   * The iOS theme can only be used with the iOS mode,
   * and the MD theme can only be used with the MD mode.
   *
   * This logic enables the fallback behavior for existing tests,
   * where we only tested against a mode, which accounted for both
   * the theme and mode.
   */
  if (theme === 'ios' || theme === 'md') {
    if (palette === 'light') {
      /**
       * Ionic has many existing tests that existed prior to
       * the introduction of theme testing. To maintain backwards
       * compatibility, we will not include the theme in the screenshot
       * name if the theme is set to light.
       */
      return `${fileName}-${mode}-${direction}.png`;
    }
    return `${fileName}-${mode}-${direction}-${palette}.png`;
  }

  return `${fileName}-${theme}-${mode}-${direction}-${palette}.png`;
};

/**
 * Given a config generate an array of test variants.
 */
export const configs = (testConfig: TestConfigOption = DEFAULT_TEST_CONFIG_OPTION): TestUtilities[] => {
  const { modes, directions } = testConfig;

  const configs: TestConfig[] = [];

  /**
   * If certain options are not provided,
   * fall back to the defaults.
   */
  const processedModes = modes ?? DEFAULT_MODES;
  const processedDirection = directions ?? DEFAULT_DIRECTIONS;
  const processedPalette = testConfig.palettes ?? DEFAULT_PALETTES;

  processedModes.forEach((mode) => {
    let theme: Theme;
    let modeName: Mode;

    if (mode.indexOf('-') === -1) {
      /**
       * If the mode does not contain a dash, then it is
       * either the ios or md configuration, where both
       * the mode and theme are the same.
       */
      theme = mode as Theme;
      modeName = mode as Mode;
    } else {
      [theme, modeName] = mode.split('-') as [Theme, Mode];
    }

    processedDirection.forEach((direction) => {
      processedPalette.forEach((palette) => {
        configs.push({ direction, palette, mode: modeName, theme });
      });
    });
  });

  return configs.map((config) => {
    return {
      config,
      title: (title: string) => generateTitle(title, config),
      screenshot: (fileName: string) => generateScreenshotName(fileName, config),
    };
  });
};

const DEFAULT_MODES: Mode[] = ['ios', 'md'];
const DEFAULT_DIRECTIONS: Direction[] = ['ltr', 'rtl'];
const DEFAULT_PALETTES: Palette[] = ['light'];

const DEFAULT_TEST_CONFIG_OPTION = {
  modes: DEFAULT_MODES,
  directions: DEFAULT_DIRECTIONS,
  palettes: DEFAULT_PALETTES,
};
