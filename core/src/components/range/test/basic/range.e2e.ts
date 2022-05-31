import { expect } from '@playwright/test';
import { dragElementBy, test } from '@utils/test/playwright';

test.describe('range: basic', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/range/test/basic`);

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`range-diff-${page.getSnapshotSettings()}.png`);
  });

  test('should emit start/end events', async ({ page }) => {
    await page.setContent(`<ion-range value="20"></ion-range>`);

    const rangeStart = await page.spyOnEvent('ionKnobMoveStart');
    const rangeEnd = await page.spyOnEvent('ionKnobMoveEnd');

    const rangeEl = page.locator('ion-range');

    await dragElementBy(rangeEl, page, 300, 0);
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

  test('should not scroll when the knob is swiped', async ({ page, browserName }, testInfo) => {
    test.skip(browserName === 'webkit', 'mouse.wheel is not available in WebKit');
    test.skip(testInfo.project.metadata.rtl === true, 'This feature does not have RTL-specific behaviors');

    await page.goto(`/src/components/range/test/basic`);

    const knobEl = page.locator('ion-range#stacked-range .range-knob-handle');
    const scrollEl = page.locator('ion-content .inner-scroll');

    expect(await scrollEl.evaluate((el: HTMLElement) => el.scrollTop)).toEqual(0);

    const box = (await knobEl.boundingBox())!;
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;

    await page.mouse.move(centerX, centerY);
    await page.mouse.down();
    await page.mouse.move(centerX + 30, centerY);

    /**
     * Do not use scrollToBottom() or other scrolling methods
     * on ion-content as those will update the scroll position.
     * Setting scrollTop still works even with overflow-y: hidden.
     * However, simulating a user gesture should not scroll the content.
     */
    await page.mouse.wheel(0, 100);
    await page.waitForChanges();

    expect(await scrollEl.evaluate((el: HTMLElement) => el.scrollTop)).toEqual(0);
  });
});
