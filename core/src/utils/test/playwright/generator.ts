import type { E2EPageOptions } from '@utils/test/playwright';

interface GeneratorConfig {
  modes?: string[];
  directions?: string[];
  _testing?: boolean;
}

interface GeneratedConfig {
  title: (t: string) => string;
  config: E2EPageOptions;
}

/**
 * Generates config variants for block
 * of tests. This ensures that we can run
 * tests for iOS mode with LTR, iOS mode with RTL,
 * MD mode with LTR, and MD mode with RTL.
 * Developers can also pass a custom config to get
 * a subset of these options without the need to
 * manually skip tests.
 * @param config - Options that define which kinds
 * of tests you want to run.
 */
export const configs = (
  config: GeneratorConfig = {
    modes: ['ios', 'md'],
    directions: ['ltr', 'rtl'],
    _testing: true,
  }
): GeneratedConfig[] => {
  const { modes, directions, _testing } = config;
  const configs: E2EPageOptions[] = [];

  /**
   * If developers only pass modes, we should assume they
   * want the default directions config and vice versa.
   */
  const processedModes = modes ?? ['ios', 'md'];
  const processedDirections = directions ?? ['ltr', 'rtl'];
  const processedTesting = _testing ?? true;

  /**
   * Generate all mode and direction combinations.
   */
  processedModes.forEach((mode) => {
    processedDirections.forEach((direction) => {
      configs.push({ _mode: mode, _direction: direction, _testing: processedTesting });
    });
  });

  /**
   * Return the configs back to the test file
   * including a `title` function that can be
   * used to generate unique titles based on the config.
   */
  return configs.map((config) => {
    return {
      title: (t: string) => generateTitle(t, config),
      config,
    };
  });
};

/**
 * Given a title and a config,
 * generate a unique title.
 * @param title - The title of a test
 * @param config - The Ionic config for a single test
 */
const generateTitle = (title: string, config: E2EPageOptions) => {
  return `${title} ${config._mode}/${config._direction}`;
};
