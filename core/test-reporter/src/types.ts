/**
 * Suite = test file or a test.describe block
 * Spec = A single e2e test
 * Tests = A single spec run for n project configurations
 */

export interface PlaywrightTest {
  status: 'expected' | 'failed' | 'flaky';
}

export interface PlaywrightSpec {
  title: string;
  tests: PlaywrightTest[];
}

export interface PlaywrightSuite {
  title: string;
  suites?: PlaywrightSuite[];
  specs?: PlaywrightSpec[];
}

export interface PlaywrightResults {
  suites: PlaywrightSuite[];
}

export interface FlakySuite {
  title: string;
  specs: FlakySpec[];
}

export interface FlakySpec {
  title: string;
  tests: PlaywrightTest[];
}
