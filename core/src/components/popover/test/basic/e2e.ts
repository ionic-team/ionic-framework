import type { E2EPage } from '@stencil/core/testing';
import { newE2EPage } from '@stencil/core/testing';

import { testPopover } from '../test.utils';

const DIRECTORY = 'basic';

/**
 * Focusing happens async inside of popover so we need
 * to wait for the requestAnimationFrame to fire.
 */
const expectActiveElementTextToEqual = async (page: E2EPage, textValue: string) => {
  await page.evaluate((text) => document.activeElement!.textContent === text, textValue);
};

const getActiveElementSelectionStart = (page: E2EPage) => {
  return page.evaluate(() =>
    document.activeElement instanceof HTMLTextAreaElement ? document.activeElement.selectionStart : null
  );
};

const getActiveElementScrollTop = (page: E2EPage) => {
  return page.evaluate(() => {
    // Returns the closest ion-textarea or active element
    const target = document.activeElement!.closest('ion-textarea') ?? document.activeElement;
    return target!.scrollTop;
  });
};

test('popover: basic', async () => {
  await testPopover(DIRECTORY, '#basic-popover');
});

test('popover: translucent', async () => {
  await testPopover(DIRECTORY, '#translucent-popover');
});

test('popover: long list', async () => {
  await testPopover(DIRECTORY, '#long-list-popover');
});

test('popover: no event', async () => {
  await testPopover(DIRECTORY, '#no-event-popover');
});

test('popover: custom class', async () => {
  await testPopover(DIRECTORY, '#custom-class-popover');
});

test('popover: header', async () => {
  await testPopover(DIRECTORY, '#header-popover');
});

test('popover: translucent header', async () => {
  await testPopover(DIRECTORY, '#translucent-header-popover');
});

/**
 * RTL Tests
 */

test('popover:rtl: basic', async () => {
  await testPopover(DIRECTORY, '#basic-popover', true, true);
});

test('popover:rtl: translucent', async () => {
  await testPopover(DIRECTORY, '#translucent-popover', true, true);
});

test('popover:rtl: long list', async () => {
  await testPopover(DIRECTORY, '#long-list-popover', true, true);
});

test('popover:rtl: no event', async () => {
  await testPopover(DIRECTORY, '#no-event-popover', true, true);
});

test('popover:rtl: custom class', async () => {
  await testPopover(DIRECTORY, '#custom-class-popover', true, true);
});

test('popover:rtl: header', async () => {
  await testPopover(DIRECTORY, '#header-popover', true);
});

test('popover:rtl: translucent header', async () => {
  await testPopover(DIRECTORY, '#translucent-header-popover', true);
});

test('popover: htmlAttributes', async () => {
  const page = await newE2EPage({ url: '/src/components/popover/test/basic?ionic:_testing=true' });

  await page.click('#basic-popover');
  await page.waitForSelector('#basic-popover');

  const alert = await page.find('ion-popover');

  expect(alert).not.toBe(null);
  await alert.waitForVisible();

  const attribute = await page.evaluate(() => document.querySelector('ion-popover')!.getAttribute('data-testid'));

  expect(attribute).toEqual('basic-popover');
});

describe('popover: focus trap', () => {
  it('should focus the first ion-item on ArrowDown', async () => {
    const page = await newE2EPage({ url: '/src/components/popover/test/basic?ionic:_testing=true' });

    await page.click('#basic-popover');

    const popover = await page.find('ion-popover');

    expect(popover).not.toBe(null);
    await popover.waitForVisible();

    await page.keyboard.press('ArrowDown');

    await expectActiveElementTextToEqual(page, 'Item 0');
  });

  it('should work with ion-item children', async () => {
    const page = await newE2EPage({ url: '/src/components/popover/test/basic?ionic:_testing=true' });

    await page.click('#basic-popover');
    await page.waitForSelector('#basic-popover');

    const popover = await page.find('ion-popover');

    expect(popover).not.toBe(null);
    await popover.waitForVisible();

    await page.keyboard.press('Tab');

    await expectActiveElementTextToEqual(page, 'Item 0');

    await page.keyboard.down('Shift');
    await page.keyboard.press('Tab');
    await page.keyboard.up('Shift');

    await expectActiveElementTextToEqual(page, 'Item 3');

    await page.keyboard.press('Tab');

    await expectActiveElementTextToEqual(page, 'Item 0');

    await page.keyboard.press('ArrowDown');

    await expectActiveElementTextToEqual(page, 'Item 1');

    await page.keyboard.press('ArrowDown');

    await expectActiveElementTextToEqual(page, 'Item 2');

    await page.keyboard.press('Home');

    await expectActiveElementTextToEqual(page, 'Item 0');

    await page.keyboard.press('End');

    await expectActiveElementTextToEqual(page, 'Item 3');
  });

  it('should not override keyboard interactions for textarea elements', async () => {
    const page = await newE2EPage({ url: '/src/components/popover/test/basic?ionic:_testing=true' });

    await page.waitForSelector('#popover-with-textarea');
    await page.click('#popover-with-textarea');

    const popover = await page.find('ion-popover');
    await popover.waitForVisible();

    await page.waitForFunction('document.activeElement.tagName === "ION-POPOVER"');

    await page.keyboard.press('Tab');
    // Checking within ion-textarea

    let activeElementTagName = await page.evaluate(() => document.activeElement!.tagName);
    let scrollTop = null;
    let selectionStart = null;
    let previousSelectionStart = null;

    // This is the native textarea within ion-textarea
    expect(activeElementTagName).toBe('TEXTAREA');

    selectionStart = await getActiveElementSelectionStart(page);
    expect(selectionStart).toBe(0);

    await page.keyboard.press('ArrowDown');

    selectionStart = await getActiveElementSelectionStart(page);
    expect(selectionStart).toBeGreaterThan(0);
    previousSelectionStart = selectionStart;

    await page.keyboard.press('ArrowDown');

    selectionStart = await getActiveElementSelectionStart(page);
    expect(selectionStart).toBeGreaterThan(previousSelectionStart!);

    await page.keyboard.press('Tab');
    // Checking within HTML textarea

    // Reset tracking variables as the focus element has changed
    scrollTop = null;
    selectionStart = null;
    previousSelectionStart = null;

    activeElementTagName = await page.evaluate(() => document.activeElement!.tagName);
    expect(activeElementTagName).toBe('TEXTAREA');

    selectionStart = await getActiveElementSelectionStart(page);
    expect(selectionStart).toBe(0);

    await page.keyboard.press('ArrowDown');

    selectionStart = await getActiveElementSelectionStart(page);
    expect(selectionStart).toBeGreaterThan(0);
    previousSelectionStart = selectionStart;

    await page.keyboard.press('ArrowDown');

    selectionStart = await getActiveElementSelectionStart(page);
    expect(selectionStart).toBeGreaterThan(previousSelectionStart!);

    await page.keyboard.press('Home');

    scrollTop = await getActiveElementScrollTop(page);
    expect(scrollTop).toBeGreaterThan(0);

    const previousScrollTop = scrollTop;

    await page.keyboard.press('End');

    scrollTop = await getActiveElementScrollTop(page);
    expect(scrollTop).toBeGreaterThanOrEqual(previousScrollTop);
  });
});
