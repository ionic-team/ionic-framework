import { newE2EPage } from '@stencil/core/testing';

/**
 * This test emulates zoom behavior in the browser to make sure
 * that key functions of the ion-datetime continue to function even
 * if the page is zoomed in or out.
 */
describe('datetime: zoom interactivity', () => {

  let deviceScaleFactor;

  describe('zoom out', () => {

    beforeEach(() => {
      deviceScaleFactor = 0.75;
    });

    test('should update the month when next button is clicked', async () => {
      const page = await newE2EPage({
        url: '/src/components/datetime/test/sub-pixel-width?ionic:_testing=true'
      });

      page.setViewport({
        width: 640,
        height: 480,
        deviceScaleFactor
      });

      const openModalBtn = await page.find('#open-modal');

      await openModalBtn.click();

      const modal = await page.find('ion-modal');
      await modal.waitForVisible();
      await page.waitForTimeout(250);

      const buttons = await page.findAll('ion-datetime >>> .calendar-next-prev ion-button')

      await buttons[1].click();

      await page.waitForTimeout(350);

      const monthYear = await page.find('ion-datetime >>> .calendar-month-year');

      expect(monthYear.textContent.trim()).toBe('March 2022');
    });

    test('should update the month when prev button is clicked', async () => {
      const page = await newE2EPage({
        url: '/src/components/datetime/test/sub-pixel-width?ionic:_testing=true'
      });

      const openModalBtn = await page.find('#open-modal');

      await openModalBtn.click();

      const modal = await page.find('ion-modal');
      await modal.waitForVisible();
      await page.waitForTimeout(250);

      const buttons = await page.findAll('ion-datetime >>> .calendar-next-prev ion-button')

      await buttons[0].click();

      await page.waitForTimeout(350);

      const monthYear = await page.find('ion-datetime >>> .calendar-month-year');

      expect(monthYear.textContent.trim()).toBe('January 2022');
    });

  });

  describe('zoom in', () => {

    beforeEach(() => {
      deviceScaleFactor = 2;
    });

    test('should update the month when next button is clicked', async () => {
      const page = await newE2EPage({
        url: '/src/components/datetime/test/sub-pixel-width?ionic:_testing=true'
      });

      page.setViewport({
        width: 640,
        height: 480,
        deviceScaleFactor
      });

      const openModalBtn = await page.find('#open-modal');

      await openModalBtn.click();

      const modal = await page.find('ion-modal');
      await modal.waitForVisible();
      await page.waitForTimeout(250);

      const buttons = await page.findAll('ion-datetime >>> .calendar-next-prev ion-button')

      await buttons[1].click();

      await page.waitForTimeout(350);

      const monthYear = await page.find('ion-datetime >>> .calendar-month-year');

      expect(monthYear.textContent.trim()).toBe('March 2022');
    });

    test('should update the month when prev button is clicked', async () => {
      const page = await newE2EPage({
        url: '/src/components/datetime/test/sub-pixel-width?ionic:_testing=true'
      });

      const openModalBtn = await page.find('#open-modal');

      await openModalBtn.click();

      const modal = await page.find('ion-modal');
      await modal.waitForVisible();
      await page.waitForTimeout(250);

      const buttons = await page.findAll('ion-datetime >>> .calendar-next-prev ion-button')

      await buttons[0].click();

      await page.waitForTimeout(350);

      const monthYear = await page.find('ion-datetime >>> .calendar-month-year');

      expect(monthYear.textContent.trim()).toBe('January 2022');
    });

  });

});
