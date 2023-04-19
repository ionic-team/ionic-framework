export type Mode = 'ios' | 'md';
export type Direction = 'ltr' | 'rtl';

export interface TestConfig {
  mode: Mode;
  direction: Direction;
}

interface TestUtilities {
  title: (title: string) => string;
  screenshot: (fileName: string) => string;
  config: TestConfig;
}

interface TestConfigOption {
  modes?: Mode[];
  directions?: Direction[];
}

/**
 * Generates a unique test title based on a base title
 * and a test config. Playwright uses test titles to generate
 * test IDs for the test reports, so it's important that
 * each test title is unique.
 */
const generateTitle = (title: string, config: TestConfig): string => {
  const { mode, direction } = config;

  return `${title} - ${mode}/${direction}`;
};

/**
 * Generates a unique filename based on a base filename
 * and a test config.
 */
const generateScreenshotName = (fileName: string, config: TestConfig): string => {
  const { mode, direction } = config;

  return `${fileName}-${mode}-${direction}.png`;
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
  const processedMode: Mode[] = modes ?? DEFAULT_MODES;
  const processedDirection: Direction[] = directions ?? DEFAULT_DIRECTIONS;

  processedMode.forEach((mode: Mode) => {
    processedDirection.forEach((direction: Direction) => {
      configs.push({ mode, direction });
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

const DEFAULT_TEST_CONFIG_OPTION = {
  modes: DEFAULT_MODES,
  directions: DEFAULT_DIRECTIONS,
};
