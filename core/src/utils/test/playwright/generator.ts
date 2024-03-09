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
export type ThemeMode = 'light' | 'dark' | 'high-contrast' | 'high-contrast-dark';

export type TitleFn = (title: string) => string;
export type ScreenshotFn = (fileName: string) => string;

export interface TestConfig {
  direction: Direction;
  themeMode: ThemeMode;
  theme: Theme;
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
  themeModes?: ThemeMode[];
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
  const { direction, themeMode, theme, mode } = config;

  return `${title} - ${theme}/${mode}/${direction}/${themeMode}`;
};

/**
 * Generates a unique filename based on a base filename
 * and a test config.
 */
const generateScreenshotName = (fileName: string, config: TestConfig): string => {
  const { theme, direction, themeMode, mode } = config;
  if (themeMode === 'light') {
    /**
     * Ionic has many existing tests that existed prior to
     * the introduction of theme testing. To maintain backwards
     * compatibility, we will not include the theme in the screenshot
     * name if the theme is set to light.
     */
    return `${fileName}-${mode}-${direction}.png`;
  }

  if (theme === mode) {
    /**
     * Fallback to the old screenshot naming convention
     * when the theme and mode are the same.
     */
    return `${fileName}-${theme}-${direction}-${themeMode}.png`;
  }

  return `${fileName}-${theme}-${mode}-${direction}-${themeMode}.png`;
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
  const processedThemeMode = testConfig.themeModes ?? DEFAULT_THEME_MODES;

  processedModes.forEach((mode) => {
    processedTheme.forEach((theme) => {
      processedDirection.forEach((direction) => {
        processedThemeMode.forEach((themeMode) => {
          configs.push({ theme, direction, themeMode, mode });
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
const DEFAULT_THEME_MODES: ThemeMode[] = ['light'];

const DEFAULT_TEST_CONFIG_OPTION = {
  themes: DEFAULT_THEMES,
  directions: DEFAULT_DIRECTIONS,
  DEFAULT_THEME_MODES: DEFAULT_THEME_MODES,
};
