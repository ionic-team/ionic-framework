import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('modal: a11y'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      await page.goto(`/src/components/modal/test/a11y`, config);

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const button = page.locator('#open-modal');
      const modal = page.locator('ion-modal .modal-wrapper');

      await expect(modal).toHaveAttribute('role', 'dialog');

      await button.click();
      await ionModalDidPresent.next();

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });

    test('should move focus to the dialog wrapper, not the role-less host, on present', async ({ page }) => {
      /**
       * `role="dialog"`/`aria-modal` live on `.modal-wrapper` inside the
       * shadow root, not on the `ion-modal` host. Assistive technologies
       * (e.g. Android TalkBack) rely on the focus target itself carrying
       * that role/label to know a dialog opened. If focus lands on the
       * host instead, TalkBack has no accessible dialog to land on and
       * users cannot navigate into the modal's content (IONIC-91 / FW-7611).
       */
      await page.goto(`/src/components/modal/test/a11y`, config);

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const button = page.locator('#open-modal');

      await button.click();
      await ionModalDidPresent.next();

      const focusedRole = await page.evaluate(() => {
        const modal = document.querySelector('ion-modal')!;
        return modal.shadowRoot?.activeElement?.getAttribute('role') ?? null;
      });

      expect(focusedRole).toBe('dialog');
    });
  });
});
