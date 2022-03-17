import type { E2EPage } from '@stencil/core/testing';
import { newE2EPage } from '@stencil/core/testing';

describe('nested popovers', () => {
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage({ url: '/src/components/popover/test/nested?ionic:_testing=true' });
  });

  test('nested popover should render correctly', async () => {
    const screenshotCompares = [];

    const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

    await page.click('#first-trigger');

    await ionPopoverDidPresent.next();

    const parentPopover = await page.find('.parent-popover');
    expect(parentPopover).not.toHaveClass('overlay-hidden');

    await page.click('#open-with-popover');

    await ionPopoverDidPresent.next();

    const nestedPopover = await page.find('.child-popover-one');
    expect(nestedPopover).not.toHaveClass('overlay-hidden');

    screenshotCompares.push(await page.compareScreenshot());

    for (const screenshotCompare of screenshotCompares) {
      expect(screenshotCompare).toMatchScreenshot();
    }
  });

  test('nested popover should dismiss when clicking backdrop', async () => {
    const screenshotCompares = [];

    const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');
    const ionPopoverDidDismiss = await page.spyOnEvent('ionPopoverDidDismiss');

    await page.click('#first-trigger');

    await ionPopoverDidPresent.next();

    const parentPopover = await page.find('.parent-popover');
    expect(parentPopover).not.toHaveClass('overlay-hidden');

    await page.click('#open-with-popover');

    await ionPopoverDidPresent.next();

    const nestedPopover = await page.find('.child-popover-one');
    expect(nestedPopover).not.toHaveClass('overlay-hidden');

    screenshotCompares.push(await page.compareScreenshot());

    const backdrop = await page.find('.parent-popover >>> ion-backdrop');
    await backdrop.click();

    await ionPopoverDidDismiss.next();

    const nestedPopoverAgain = await page.find('.child-popover-one');
    expect(nestedPopoverAgain).toHaveClass('overlay-hidden');

    screenshotCompares.push(await page.compareScreenshot());

    for (const screenshotCompare of screenshotCompares) {
      expect(screenshotCompare).toMatchScreenshot();
    }
  });
});
