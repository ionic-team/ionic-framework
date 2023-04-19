type Mode = 'ios' | 'md';
type Direction = 'ltr' | 'rtl';

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
  mode?: Mode[];
  direction?: Direction[];
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
  const { mode, direction } = testConfig;

  const configs: TestConfig[] = [];

  /**
   * If certain options are not provided,
   * fall back to the defaults.
   */
  const processedMode: Mode[] = mode ?? DEFAULT_MODE;
  const processedDirection: Direction[] = direction ?? DEFAULT_DIRECTION;

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

const DEFAULT_MODE: Mode[] = ['ios', 'md'];
const DEFAULT_DIRECTION: Direction[] = ['ltr', 'rtl'];

const DEFAULT_TEST_CONFIG_OPTION = {
  mode: DEFAULT_MODE,
  direction: DEFAULT_DIRECTION,
};
