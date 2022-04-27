import { expect } from '@playwright/test';
import { test, dragElementBy } from '@utils/test/playwright';

test.describe('sheet modal: rendering', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto('/src/components/modal/test/sheet');
    const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

    await page.click('#sheet-modal');

    await ionModalDidPresent.next();

    expect(await page.screenshot()).toMatchSnapshot(`modal-sheet-present-${page.getSnapshotSettings()}.png`);
  });
});

test.describe('sheet modal: backdrop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/components/modal/test/sheet');
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

    await page.click('#backdrop-inactive');
    await ionModalDidPresent.next();

    await page.click('#custom-height-modal');
    await ionModalDidPresent.next();

    await page.waitForSelector('.custom-height', { state: 'visible' });
  });
  test('input outside sheet modal should be focusable when backdrop is inactive', async ({ page }) => {
    const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

    await page.click('#backdrop-inactive');

    await ionModalDidPresent.next();

    const input = await page.locator('#root-input input');
    await input.click();
    expect(input).toBeFocused();
  });
});

test.describe('sheet modal: setting the breakpoint', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/components/modal/test/sheet');
  });
  test.describe('sheet modal: invalid values', () => {
    let warnings: string[] = [];
    test.beforeEach(async ({ page }) => {
      warnings = [];

      page.on('console', (ev) => {
        if (ev.type() === 'warning') {
          warnings.push(ev.text());
        }
      });

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#sheet-modal');
      await ionModalDidPresent.next();

      const modal = await page.locator('ion-modal');
      await modal.evaluate((el: HTMLIonModalElement) => el.setCurrentBreakpoint(0.01));
    });
    test('it should not change the breakpoint when setting to an invalid value', async ({ page }) => {
      const modal = await page.locator('ion-modal');
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
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#sheet-modal');
      await ionModalDidPresent.next();
    });
    test('should update the current breakpoint', async ({ page }) => {
      const ionBreakpointDidChange = await page.spyOnEvent('ionBreakpointDidChange');
      const modal = await page.locator('.modal-sheet');

      await modal.evaluate((el: HTMLIonModalElement) => el.setCurrentBreakpoint(0.5));
      await ionBreakpointDidChange.next();

      const breakpoint = await modal.evaluate((el: HTMLIonModalElement) => el.getCurrentBreakpoint());
      expect(breakpoint).toBe(0.5);
    });
    test('should emit ionBreakpointDidChange', async ({ page }) => {
      const ionBreakpointDidChange = await page.spyOnEvent('ionBreakpointDidChange');
      const modal = await page.locator('.modal-sheet');

      await modal.evaluate((el: HTMLIonModalElement) => el.setCurrentBreakpoint(0.5));
      await ionBreakpointDidChange.next();
      expect(ionBreakpointDidChange.events.length).toBe(1);
    });
    test('should emit ionBreakpointDidChange when breakpoint is set to 0', async ({ page }) => {
      const ionBreakpointDidChange = await page.spyOnEvent('ionBreakpointDidChange');
      const modal = await page.locator('.modal-sheet');

      await modal.evaluate((el: HTMLIonModalElement) => el.setCurrentBreakpoint(0));
      await ionBreakpointDidChange.next();
      expect(ionBreakpointDidChange.events.length).toBe(1);
    });
    test('should emit ionBreakpointDidChange when the sheet is swiped to breakpoint 0', async ({ page }) => {
      const ionBreakpointDidChange = await page.spyOnEvent('ionBreakpointDidChange');
      const header = await page.locator('.modal-sheet ion-header');

      await dragElementBy(header, page, 0, 500);

      await ionBreakpointDidChange.next();

      expect(ionBreakpointDidChange.events.length).toBe(1);
    });
  });
});
