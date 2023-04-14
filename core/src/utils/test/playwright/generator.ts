type Mode = 'ios' | 'md';
type Direction = 'ltr' | 'rtl';
type Theme = 'default' | 'dark';

export interface TestConfig {
  mode: Mode;
  direction: Direction;
  theme: Theme;
}

interface TestUtilities {
  title: (title: string) => string;
  config: TestConfig;
}

interface TestConfigOption {
  mode?: Mode[];
  direction?: Direction[];
  theme?: Theme[];
}

/**
 * Generates a unique test title based on a base title
 * and a test config. Playwright uses test titles to generate
 * test IDs for the test reports, so it's important that
 * each test title is unique.
 */
const generateTitle = (title: string, config: TestConfig): string => {
  const { mode, direction, theme } = config;

  return `${title} - ${mode}/${direction}/${theme}`;
};

export const configs = (testConfig: TestConfigOption = DEFAULT_TEST_CONFIG_OPTION): TestUtilities[] => {
  const { mode, direction, theme } = testConfig;

  const configs: TestConfig[] = [];

  /**
   * If certain options are not provided,
   * fall back to the defaults.
   */
  const processedMode: Mode[] = mode ?? DEFAULT_MODE;
  const processedDirection: Direction[] = direction ?? DEFAULT_DIRECTION;
  const processedTheme: Theme[] = theme ?? DEFAULT_THEME;

  processedMode.forEach((mode: Mode) => {
    processedDirection.forEach((direction: Direction) => {
      processedTheme.forEach((theme: Theme) => {
        configs.push({ mode, direction, theme });
      });
    });
  });

  return configs.map((config) => {
    return {
      config,
      title: (title: string) => generateTitle(title, config),
    };
  });
};

const DEFAULT_MODE: Mode[] = ['ios', 'md'];
const DEFAULT_DIRECTION: Direction[] = ['ltr', 'rtl'];
const DEFAULT_THEME: Theme[] = ['default', 'dark'];

const DEFAULT_TEST_CONFIG_OPTION = {
  mode: DEFAULT_MODE,
  direction: DEFAULT_DIRECTION,
  theme: DEFAULT_THEME,
};
