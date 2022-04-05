import type { E2EElement, E2EPage } from '@stencil/core/testing';
import { newE2EPage } from '@stencil/core/testing';
import { getActiveElement, getActiveElementParent, dragElementBy } from '@utils/test';

import { openModal, testModal, testModal } from '../test.utils';

const DIRECTORY = 'sheet';

test('modal: sheet', async () => {
  await testModal(DIRECTORY, '#sheet-modal');
});

test('modal:rtl: sheet', async () => {
  await testModal(DIRECTORY, '#sheet-modal', true);
});

test('modal - open', async () => {
  const screenshotCompares = [];
  const page = await newE2EPage({ url: '/src/components/modal/test/sheet?ionic:_testing=true' });

  await page.click('#sheet-modal');

  const modal = await page.find('ion-modal');
  await modal.waitForVisible();

  screenshotCompares.push(await page.compareScreenshot());

  await modal.callMethod('dismiss');
  await modal.waitForNotVisible();

  screenshotCompares.push(await page.compareScreenshot('dismiss'));

  await page.click('#sheet-modal');

  const modalAgain = await page.find('ion-modal');
  await modalAgain.waitForVisible();

  screenshotCompares.push(await page.compareScreenshot());

  await modalAgain.callMethod('dismiss');
  await modalAgain.waitForNotVisible();

  screenshotCompares.push(await page.compareScreenshot('dismiss'));

  for (const screenshotCompare of screenshotCompares) {
    expect(screenshotCompare).toMatchScreenshot();
  }
});

test('should click to dismiss sheet modal', async () => {
  const page = await newE2EPage({ url: '/src/components/modal/test/sheet?ionic:_testing=true' });
  const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

  await page.click('#sheet-modal');

  const modal = await page.find('ion-modal');
  await modal.waitForVisible();

  await page.mouse.click(50, 50);

  await ionModalDidDismiss.next();
});

test('should click to dismiss sheet modal when backdrop is active', async () => {
  const page = await newE2EPage({ url: '/src/components/modal/test/sheet?ionic:_testing=true' });
  const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

  await page.click('#backdrop-active');

  const modal = await page.find('ion-modal');
  await modal.waitForVisible();

  await page.mouse.click(50, 50);

  await ionModalDidDismiss.next();
});

test('should click to present another modal when backdrop is inactive', async () => {
  const page = await newE2EPage({ url: '/src/components/modal/test/sheet?ionic:_testing=true' });
  const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

  await page.click('#backdrop-inactive');

  await ionModalDidPresent.next();

  await page.click('#custom-height-modal');

  await ionModalDidPresent.next();

  const customModal = await page.find('.custom-height');
  expect(customModal).not.toBe(null);
});

test('input should be focusable when backdrop is inactive', async () => {
  const page = await newE2EPage({ url: '/src/components/modal/test/sheet?ionic:_testing=true' });
  const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

  await page.click('#backdrop-inactive');

  await ionModalDidPresent.next();

  await page.click('#root-input');

  const parentEl = await getActiveElementParent(page);
  expect(parentEl.id).toEqual('root-input');
});

test('input should not be focusable when backdrop is active', async () => {
  const page = await newE2EPage({ url: '/src/components/modal/test/sheet?ionic:_testing=true' });
  const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

  await page.click('#backdrop-active');

  await ionModalDidPresent.next();

  await page.click('#root-input');
  await page.waitForChanges();

  const parentEl = await getActiveElement(page);
  expect(parentEl.tagName).toEqual('ION-BUTTON');
});

describe('modal: sheet: setting the breakpoint', () => {
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage({
      url: '/src/components/modal/test/sheet?ionic:_testing=true',
    });
  });

  describe('setting an invalid value', () => {
    let warnings: string[];
    let modal: E2EElement;

    beforeEach(async () => {
      warnings = [];
      page.on('console', (ev) => {
        if (ev.type() === 'warning') {
          warnings.push(ev.text());
        }
      });

      modal = await openModal(page, '#sheet-modal');

      await modal.callMethod('setCurrentBreakpoint', 0.01);
    });

    it('should not change the breakpoint', async () => {
      const breakpoint = await modal.callMethod('getCurrentBreakpoint');
      expect(breakpoint).toBe(0.25);
    });

    it('should console a warning to developers', async () => {
      expect(warnings.length).toBe(1);
      expect(warnings[0]).toBe(
        '[Ionic Warning]: Attempted to set invalid breakpoint value 0.01. Please double check that the breakpoint value is part of your defined breakpoints.'
      );
    });
  });

  describe('setting the breakpoint to a valid value', () => {
    it('should update the current breakpoint', async () => {
      const modal = await openModal(page, '#sheet-modal');

      await modal.callMethod('setCurrentBreakpoint', 0.5);
      await modal.waitForEvent('ionBreakpointDidChange');

      const breakpoint = await modal.callMethod('getCurrentBreakpoint');
      expect(breakpoint).toBe(0.5);
    });

    it('should emit ionBreakpointDidChange', async () => {
      const modal = await openModal(page, '#sheet-modal');

      const ionBreakpointDidChangeSpy = await modal.spyOnEvent('ionBreakpointDidChange');

      await modal.callMethod('setCurrentBreakpoint', 0.5);
      await modal.waitForEvent('ionBreakpointDidChange');

      expect(ionBreakpointDidChangeSpy).toHaveReceivedEventTimes(1);
    });

    it('should emit ionBreakpointDidChange when breakpoint is set to 0', async () => {
      const modal = await openModal(page, '#sheet-modal');

      const ionBreakpointDidChangeSpy = await modal.spyOnEvent('ionBreakpointDidChange');

      await modal.callMethod('setCurrentBreakpoint', 0);
      await modal.waitForEvent('ionBreakpointDidChange');

      expect(ionBreakpointDidChangeSpy).toHaveReceivedEventTimes(1);
    });
  });

  it('should emit ionBreakpointDidChange when the sheet is swiped to breakpoint 0', async () => {
    const modal = await openModal(page, '#sheet-modal');

    const ionBreakpointDidChangeSpy = await modal.spyOnEvent('ionBreakpointDidChange');

    const headerEl = await page.$('ion-modal ion-header');

    await dragElementBy(headerEl, page, 0, 500);

    await modal.waitForEvent('ionBreakpointDidChange');

    expect(ionBreakpointDidChangeSpy).toHaveReceivedEventTimes(1);
  });
});

describe('clicking the handle', () => {
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage({
      url: '/src/components/modal/test/sheet?ionic:_testing=true',
    });
  });

  it('should advance to the next breakpoint', async () => {
    const modal = await openModal(page, '#sheet-modal');
    const handle = await page.find('ion-modal >>> .modal-handle');

    await handle.click();
    await modal.waitForEvent('ionBreakpointDidChange');

    expect(await modal.callMethod('getCurrentBreakpoint')).toBe(0.5);

    await handle.click();
    await modal.waitForEvent('ionBreakpointDidChange');

    expect(await modal.callMethod('getCurrentBreakpoint')).toBe(0.75);

    await handle.click();
    await modal.waitForEvent('ionBreakpointDidChange');

    expect(await modal.callMethod('getCurrentBreakpoint')).toBe(1);

    await handle.click();
    await modal.waitForEvent('ionBreakpointDidChange');

    // Advancing from the last breakpoint should change the breakpoint to the first non-zero breakpoint
    expect(await modal.callMethod('getCurrentBreakpoint')).toBe(0.25);
  });
});
