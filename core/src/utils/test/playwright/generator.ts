export type Mode = 'ios' | 'md';
export type Direction = 'ltr' | 'rtl';
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
  mode: Mode;
  direction: Direction;
  palette: Palette;
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
}

/**
 * Generates a unique test title based on a base title
 * and a test config. Playwright uses test titles to generate
 * test IDs for the test reports, so it's important that
 * each test title is unique.
 */
const generateTitle = (title: string, config: TestConfig): string => {
  const { mode, direction, palette } = config;

  if (palette === 'light') {
    /**
     * Ionic has many existing tests that existed prior to
     * the introduction of palette testing. To maintain backwards
     * compatibility, we will not include the palette in the test
     * title if the palette is set to light.
     */
    return `${title} - ${mode}/${direction}`;
  }

  return `${title} - ${mode}/${direction}/${palette}`;
};

/**
 * Generates a unique filename based on a base filename
 * and a test config.
 */
const generateScreenshotName = (fileName: string, config: TestConfig): string => {
  const { mode, direction, palette } = config;

  if (palette === 'light') {
    /**
     * Ionic has many existing tests that existed prior to
     * the introduction of palette testing. To maintain backwards
     * compatibility, we will not include the palette in the screenshot
     * name if the palette is set to light.
     */
    return `${fileName}-${mode}-${direction}.png`;
  }

  return `${fileName}-${mode}-${direction}-${palette}.png`;
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
  const processedMode = modes ?? DEFAULT_MODES;
  const processedDirection = directions ?? DEFAULT_DIRECTIONS;
  const processedPalette = testConfig.palettes ?? DEFAULT_PALETTES;

  processedMode.forEach((mode) => {
    processedDirection.forEach((direction) => {
      processedPalette.forEach((palette) => {
        configs.push({ mode, direction, palette });
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
