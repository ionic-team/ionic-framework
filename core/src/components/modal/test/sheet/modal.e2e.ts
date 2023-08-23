import { expect } from '@playwright/test';
import { configs, test, dragElementBy } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('sheet modal: rendering'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto('/src/components/modal/test/sheet', config);
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#sheet-modal');

      await ionModalDidPresent.next();

      await expect(page).toHaveScreenshot(screenshot(`modal-sheet-present`));
    });
  });
});

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('sheet modal: backdrop'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/modal/test/sheet', config);
    });
    test('should dismiss the sheet modal when clicking the active backdrop', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

      await page.click('#backdrop-active');

      await ionModalDidPresent.next();

      await page.mouse.click(50, 50);

      await ionModalDidDismiss.next();
    });
    test('should present another sheet modal when clicking an inactive backdrop', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const modal = page.locator('.custom-height');

      await page.click('#backdrop-inactive');
      await ionModalDidPresent.next();

      await page.click('#custom-height-modal');
      await ionModalDidPresent.next();

      await expect(modal).toBeVisible();
    });
    test('input outside sheet modal should be focusable when backdrop is inactive', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#backdrop-inactive');

      await ionModalDidPresent.next();

      const input = page.locator('#root-input input').first();
      await input.click();
      await expect(input).toBeFocused();
    });
  });
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

        await dragElementBy(header, page, 0, 125);

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
  test.describe(title('sheet modal: clicking the handle'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/modal/test/sheet', config);
    });

    test('should advance to the next breakpoint when handleBehavior is cycle', async ({ page }) => {
      const ionBreakpointDidChange = await page.spyOnEvent('ionBreakpointDidChange');
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const modal = page.locator('ion-modal');

      await page.click('#handle-behavior-cycle-modal');
      await ionModalDidPresent.next();

      const handle = page.locator('ion-modal .modal-handle');

      await handle.click();
      await ionBreakpointDidChange.next();

      await expect(await modal.evaluate((el: HTMLIonModalElement) => el.getCurrentBreakpoint())).toBe(0.5);

      await handle.click();
      await ionBreakpointDidChange.next();

      await expect(await modal.evaluate((el: HTMLIonModalElement) => el.getCurrentBreakpoint())).toBe(0.75);

      await handle.click();
      await ionBreakpointDidChange.next();

      await expect(await modal.evaluate((el: HTMLIonModalElement) => el.getCurrentBreakpoint())).toBe(1);

      await handle.click();
      await ionBreakpointDidChange.next();

      // Advancing from the last breakpoint should change the breakpoint to the first non-zero breakpoint
      await expect(await modal.evaluate((el: HTMLIonModalElement) => el.getCurrentBreakpoint())).toBe(0.25);
    });

    test('should not advance the breakpoint when handleBehavior is none', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const modal = page.locator('ion-modal');

      await page.click('#sheet-modal');
      await ionModalDidPresent.next();

      const handle = page.locator('ion-modal .modal-handle');

      await handle.click();

      await expect(await modal.evaluate((el: HTMLIonModalElement) => el.getCurrentBreakpoint())).toBe(0.25);
    });

    test('should not dismiss the modal when backdrop is clicked and breakpoint is moving', async ({ page }) => {
      const ionBreakpointDidChange = await page.spyOnEvent('ionBreakpointDidChange');
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const modal = page.locator('ion-modal');

      await page.click('#handle-behavior-cycle-modal');
      await ionModalDidPresent.next();

      const handle = page.locator('ion-modal .modal-handle');
      const backdrop = page.locator('ion-modal ion-backdrop');

      await handle.click();
      backdrop.click();

      await ionBreakpointDidChange.next();

      await handle.click();

      await ionBreakpointDidChange.next();

      await expect(await modal.evaluate((el: HTMLIonModalElement) => el.getCurrentBreakpoint())).toBe(0.75);
    });
  });
});
