import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('range: basic', () => {
<<<<<<< HEAD
  test.beforeEach(async ({ skip, page }) => {
=======
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/range/test/basic`);

    await page.setIonViewport();

    await expect(page).toHaveScreenshot(`range-diff-${page.getSnapshotSettings()}.png`);
  });

  /**
   * The mouse events are flaky on CI
   * TODO FW-2873
   */
  test.fixme('should emit start/end events', async ({ page }, testInfo) => {
    await page.setContent(`<ion-range value="20"></ion-range>`);

    const rangeStart = await page.spyOnEvent('ionKnobMoveStart');
    const rangeEnd = await page.spyOnEvent('ionKnobMoveEnd');

    const rangeEl = page.locator('ion-range');

    await dragElementBy(rangeEl, page, testInfo.project.metadata.rtl ? -300 : 300, 0);
    await page.waitForChanges();

    /**
     * dragElementBy defaults to starting the drag from the middle of the el,
     * so the start value should jump to 50 despite the range defaulting to 20.
     */
    expect(rangeStart).toHaveReceivedEventDetail({ value: 50 });
    expect(rangeEnd).toHaveReceivedEventDetail({ value: 100 });

    /**
     * Verify both events fire if range is clicked without dragging.
     */
    await dragElementBy(rangeEl, page, 0, 0);
    await page.waitForChanges();

    expect(rangeStart).toHaveReceivedEventDetail({ value: 50 });
    expect(rangeEnd).toHaveReceivedEventDetail({ value: 50 });
  });

  test('should emit start/end events, keyboard', async ({ page }) => {
    await page.setContent(`<ion-range value="20"></ion-range>`);

    const rangeStart = await page.spyOnEvent('ionKnobMoveStart');
    const rangeEnd = await page.spyOnEvent('ionKnobMoveEnd');

    await page.keyboard.press('Tab'); // focus first range
    await page.keyboard.press('ArrowRight');

    await rangeStart.next();
    await rangeEnd.next();

    expect(rangeStart).toHaveReceivedEventDetail({ value: 20 });
    expect(rangeEnd).toHaveReceivedEventDetail({ value: 21 });
  });

  // TODO FW-2873
  test.skip('should not scroll when the knob is swiped', async ({ page, skip }) => {
    skip.browser('webkit', 'mouse.wheel is not available in WebKit');
>>>>>>> origin/main
    skip.rtl();

    await page.goto('/src/components/range/test/basic');
  });
  test('should render default range', async ({ page }) => {
    const range = page.locator('ion-range.default');
    expect(await range.screenshot()).toMatchSnapshot(`range-default-${page.getSnapshotSettings()}.png`);
  });
  test('should render dual knob range', async ({ page }) => {
    const range = page.locator('ion-range.dual-knobs');
    expect(await range.screenshot()).toMatchSnapshot(`range-dual-knobs-${page.getSnapshotSettings()}.png`);
  });
  test('should render range with ticks', async ({ page }) => {
    const range = page.locator('ion-range.ticks');
    expect(await range.screenshot()).toMatchSnapshot(`range-ticks-${page.getSnapshotSettings()}.png`);
  });
  test('should render pin', async ({ page }) => {
    const range = page.locator('ion-range.pin');
    const knob = range.locator('.range-knob-handle');

    // Force the pin to show
    await knob.evaluate((el: HTMLElement) => el.classList.add('ion-focused'));

    expect(await range.screenshot({ animations: 'disabled' })).toMatchSnapshot(
      `range-pin-${page.getSnapshotSettings()}.png`
    );
  });
});
