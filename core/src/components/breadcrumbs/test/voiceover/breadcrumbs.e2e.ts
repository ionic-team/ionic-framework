import { expect } from '@playwright/test';
import {
  configureVoiceOverTests,
  configs,
  focusTargetForVoiceOver,
  startVoiceOver,
  test,
  voiceOverOutputString,
} from '@utils/test/playwright';

// Hardcoded label must match the collapsed indicator in breadcrumb
const COLLAPSED_INDICATOR_ARIA_LABEL = /show more breadcrumbs/i;

configs({ directions: ['ltr'], modes: ['md'] }).forEach(({ title, config }) => {
  test.describe(title('breadcrumbs: voiceover'), () => {
    configureVoiceOverTests();

    test('Home link and collapsed indicator are announced correctly', async ({ page, browserName, voiceOver }) => {
      await page.setContent(
        `
        <main>
          <ion-breadcrumbs max-items="4">
            <ion-breadcrumb href="#"> Home </ion-breadcrumb>
            <ion-breadcrumb> Electronics </ion-breadcrumb>
            <ion-breadcrumb> Photography </ion-breadcrumb>
            <ion-breadcrumb> Cameras </ion-breadcrumb>
            <ion-breadcrumb> Film </ion-breadcrumb>
            <ion-breadcrumb> 35 mm </ion-breadcrumb>
          </ion-breadcrumbs>
        </main>
      `,
        config
      );

      const breadcrumbs = page.locator('ion-breadcrumbs');
      const home = breadcrumbs.locator('a.breadcrumb-native').first();
      const collapsed = breadcrumbs.locator('button.breadcrumbs-collapsed-indicator');

      await expect(breadcrumbs).toBeVisible();

      await startVoiceOver(page, voiceOver, browserName);

      // Home breadcrumb
      await focusTargetForVoiceOver(home, voiceOver);
      const homeOutput = await voiceOverOutputString(voiceOver);
      expect(homeOutput).toMatch(/home/i);

      // Collapsed indicator
      await focusTargetForVoiceOver(collapsed, voiceOver);
      const collapsedOutput = await voiceOverOutputString(voiceOver);
      expect(collapsedOutput).toMatch(COLLAPSED_INDICATOR_ARIA_LABEL);
      expect(collapsedOutput).toMatch(/\bbutton\b/i);
    });
  });
});
