import { expect } from '@playwright/test';
import { configs, test, dragElementBy } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('sheet modal: setting the breakpoint'), () => {
    test.describe('sheet modal: invalid values', () => {
      let warnings: string[] = [];
      test.beforeEach(async ({ page }) => {
        await page.goto('/src/components/modal/test/sheet', config);

        warnings = [];

        page.on('console', (ev) => {
          if (ev.type() === 'warning') {
            warnings.push(ev.text());
          }
        });

        const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

        await page.click('#sheet-modal');
        await ionModalDidPresent.next();

        const modal = page.locator('ion-modal');
        await modal.evaluate((el: HTMLIonModalElement) => el.setCurrentBreakpoint(0.01));
      });
      test('it should not change the breakpoint when setting to an invalid value', async ({ page }) => {
        const modal = page.locator('ion-modal');
        const breakpoint = await modal.evaluate((el: HTMLIonModalElement) => el.getCurrentBreakpoint());
        expect(breakpoint).toBe(0.25);
      });
      test('it should warn when setting an invalid breakpoint', async () => {
        expect(warnings.length).toBe(1);
        expect(warnings[0]).toBe(
          '[Ionic Warning]: Attempted to set invalid breakpoint value 0.01. Please double check that the breakpoint value is part of your defined breakpoints.'
        );
      });
    });
    test.describe('sheet modal: valid values', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('/src/components/modal/test/sheet', config);
        const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

        await page.click('#sheet-modal');
        await ionModalDidPresent.next();
      });
      test('should update the current breakpoint', async ({ page }) => {
        const ionBreakpointDidChange = await page.spyOnEvent('ionBreakpointDidChange');
        const modal = page.locator('.modal-sheet');

        await modal.evaluate((el: HTMLIonModalElement) => el.setCurrentBreakpoint(0.5));
        await ionBreakpointDidChange.next();

        const breakpoint = await modal.evaluate((el: HTMLIonModalElement) => el.getCurrentBreakpoint());
        expect(breakpoint).toBe(0.5);
      });
      test('should emit ionBreakpointDidChange', async ({ page }) => {
        const ionBreakpointDidChange = await page.spyOnEvent('ionBreakpointDidChange');
        const modal = page.locator('.modal-sheet');

        await modal.evaluate((el: HTMLIonModalElement) => el.setCurrentBreakpoint(0.5));
        await ionBreakpointDidChange.next();
        expect(ionBreakpointDidChange.events.length).toBe(1);
      });
      test('should emit ionBreakpointDidChange when breakpoint is set to 0', async ({ page }) => {
        const ionBreakpointDidChange = await page.spyOnEvent('ionBreakpointDidChange');
        const modal = page.locator('.modal-sheet');

        await modal.evaluate((el: HTMLIonModalElement) => el.setCurrentBreakpoint(0));
        await ionBreakpointDidChange.next();
        expect(ionBreakpointDidChange.events.length).toBe(1);
      });
      test('should emit ionBreakpointDidChange when the sheet is swiped to breakpoint 0', async ({ page }) => {
        const ionBreakpointDidChange = await page.spyOnEvent('ionBreakpointDidChange');
        const header = page.locator('.modal-sheet ion-header');

        await dragElementBy(header, page, 0, 500);

        await ionBreakpointDidChange.next();

        expect(ionBreakpointDidChange.events.length).toBe(1);
      });
    });

    test('it should reset the breakpoint value on dismiss', async ({ page }) => {
      await page.goto('/src/components/modal/test/sheet', config);
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/25245',
      });

      await page.setContent(
        `
        <ion-content>
          <ion-button id="open-modal">Open</ion-button>
          <ion-modal trigger="open-modal" initial-breakpoint="0.25">
            <ion-content>
              <ion-button id="dismiss" onclick="modal.dismiss();">Dismiss</ion-button>
              <ion-button id="set-breakpoint">Set breakpoint</ion-button>
            </ion-content>
          </ion-modal>
        </ion-content>
        <script>
          const modal = document.querySelector('ion-modal');
          const setBreakpointButton = document.querySelector('#set-breakpoint');

          modal.breakpoints = [0.25, 0.5, 1];

          setBreakpointButton.addEventListener('click', () => {
            modal.setCurrentBreakpoint(0.5);
          });
        </script>
      `,
        config
      );

      const modal = page.locator('ion-modal');
      const dismissButton = page.locator('#dismiss');
      const openButton = page.locator('#open-modal');
      const setBreakpointButton = page.locator('#set-breakpoint');

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');
      const ionBreakpointDidChange = await page.spyOnEvent('ionBreakpointDidChange');

      await openButton.click();
      await ionModalDidPresent.next();

      await setBreakpointButton.click();
      await ionBreakpointDidChange.next();

      await dismissButton.click();
      await ionModalDidDismiss.next();

      await openButton.click();
      await ionModalDidPresent.next();

      const breakpoint = await modal.evaluate((el: HTMLIonModalElement) => el.getCurrentBreakpoint());

      expect(breakpoint).toBe(0.25);

      await setBreakpointButton.click();
      await ionBreakpointDidChange.next();

      const updatedBreakpoint = await modal.evaluate((el: HTMLIonModalElement) => el.getCurrentBreakpoint());

      expect(updatedBreakpoint).toBe(0.5);
    });
  });
});
