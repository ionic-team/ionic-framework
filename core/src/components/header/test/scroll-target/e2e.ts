import { newE2EPage } from '@stencil/core/testing';
import type { E2EPage } from '@stencil/core/testing';
import { scrollToBottom } from '@utils/test';

describe('ion-header: custom scroll target', () => {
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage({
      url: '/src/components/header/test/scroll-target?ionic:_testing=true&ionic:mode=ios',
    });
  });

  it('should match existing visual screenshots', async () => {
    const compare = await page.compareScreenshot();
    expect(compare).toMatchScreenshot();
  });

  describe('large title', () => {
    it('should display the large title initially', async () => {
      const largeHeader = await page.find('ion-header[collapse="condense"]');
      const collapseHeader = await page.find('ion-header[collapse="fade"]');

      expect(largeHeader.className).not.toContain('header-collapse-condense-inactive');
      expect(collapseHeader.className).toContain('header-collapse-condense-inactive');
    });

    describe('when the scroll container has overflow', () => {
      it('should display the collapsed title on scroll', async () => {
        const screenshotCompares = [];

        screenshotCompares.push(await page.compareScreenshot('large title expanded'));

        const largeHeader = await page.find('ion-header[collapse="condense"]');
        const collapseHeader = await page.find('ion-header[collapse="fade"]');

        await scrollToBottom(page, '#scroll-target');
        await page.waitForChanges();

        expect(largeHeader.className).toContain('header-collapse-condense-inactive');
        expect(collapseHeader.className).not.toContain('header-collapse-condense-inactive');

        screenshotCompares.push(await page.compareScreenshot('large title collapsed'));

        for (const screenshotCompare of screenshotCompares) {
          expect(screenshotCompare).toMatchScreenshot();
        }
      });
    });
  });
});
