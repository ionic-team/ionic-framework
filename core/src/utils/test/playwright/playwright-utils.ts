import type { TestInfo } from "@playwright/test"

/**
 * Returns `true` if the given project test info is a Linux device.
 * @param testInfo The playwright test info
 * @returns `true` if the test is being ran on a Linux user agent
 */
export const isLinuxUserAgent = (testInfo: TestInfo) => {
  return testInfo.project.metadata.userAgent.includes(/Linux/);
}
