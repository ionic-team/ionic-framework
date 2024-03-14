import { isModeValidForTheme } from '../../../global/ionic-global';

export type Mode = 'ios' | 'md';
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
  theme: Theme;
  palette: Palette;
  mode: Mode;
}

interface TestUtilities {
  title: TitleFn;
  screenshot: ScreenshotFn;
  config: TestConfig;
}

interface TestConfigOption {
  modes?: Mode[];
  directions?: Direction[];
  palettes?: Palette[];
  /**
   * The individual themes (iOS, Material Design and Ionic) to test
   * against. If unspecified, defaults iOS and Material Design
   */
  themes?: Theme[];
}

/**
 * Generates a unique test title based on a base title
 * and a test config. Playwright uses test titles to generate
 * test IDs for the test reports, so it's important that
 * each test title is unique.
 */
const generateTitle = (title: string, config: TestConfig): string => {
  const { direction, palette, theme, mode } = config;

  if (theme === mode) {
    /**
     * Fallback to the old test title naming convention
     * when the theme and mode are the same.
     */

    if (palette === 'light') {
      /**
       * Ionic has many existing tests that existed prior to
       * the introduction of theme testing. To maintain backwards
       * compatibility, we will not include the theme in the test
       * title if the theme is set to light.
       */
      return `${title} - ${theme}/${direction}`;
    }

    return `${title} - ${theme}/${direction}/${palette}`;
  }

  return `${title} - ${theme}/${mode}/${direction}/${palette}`;
};

/**
 * Generates a unique filename based on a base filename
 * and a test config.
 */
const generateScreenshotName = (fileName: string, config: TestConfig): string => {
  const { theme, direction, palette, mode } = config;

  if (theme === mode) {
    /**
     * Fallback to the old screenshot naming convention
     * when the theme and mode are the same.
     */
    if (palette === 'light') {
      /**
       * Ionic has many existing tests that existed prior to
       * the introduction of theme testing. To maintain backwards
       * compatibility, we will not include the theme in the screenshot
       * name if the theme is set to light.
       */
      return `${fileName}-${theme}-${direction}.png`;
    }

    return `${fileName}-${theme}-${direction}-${palette}.png`;
  }

  return `${fileName}-${theme}-${mode}-${direction}-${palette}.png`;
};

/**
 * Given a config generate an array of test variants.
 */
export const configs = (testConfig: TestConfigOption = DEFAULT_TEST_CONFIG_OPTION): TestUtilities[] => {
  const { modes, themes, directions } = testConfig;

  const configs: TestConfig[] = [];

  /**
   * If certain options are not provided,
   * fall back to the defaults.
   */
  const processedModes = modes ?? DEFAULT_MODES;
  const processedTheme = themes ?? DEFAULT_THEMES;
  const processedDirection = directions ?? DEFAULT_DIRECTIONS;
  const processedPalette = testConfig.palettes ?? DEFAULT_PALETTES;

  processedModes.forEach((mode) => {
    processedTheme.forEach((theme) => {
      if (!isModeValidForTheme(mode, theme)) {
        return;
      }
      processedDirection.forEach((direction) => {
        processedPalette.forEach((palette) => {
          configs.push({ theme, direction, palette, mode });
        });
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
const DEFAULT_THEMES: Theme[] = ['ios', 'md'];
const DEFAULT_DIRECTIONS: Direction[] = ['ltr', 'rtl'];
const DEFAULT_PALETTES: Palette[] = ['light'];

const DEFAULT_TEST_CONFIG_OPTION = {
  modes: DEFAULT_MODES,
  themes: DEFAULT_THEMES,
  directions: DEFAULT_DIRECTIONS,
  palettes: DEFAULT_PALETTES,
};
