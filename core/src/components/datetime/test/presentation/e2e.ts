import { newE2EPage, E2EPage } from '@stencil/core/testing';

test('presentation', async () => {
  const page = await newE2EPage({
    url: '/src/components/datetime/test/presentation?ionic:_testing=true'
  });

  const screenshotCompares = [];

  screenshotCompares.push(await page.compareScreenshot());

  for (const screenshotCompare of screenshotCompares) {
    expect(screenshotCompare).toMatchScreenshot();
  }
});

describe('presentation: time', () => {

  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage({
      url: '/src/components/datetime/test/presentation?ionic:_testing=true'
    });
  });

  describe('when the time picker is visible in the view', () => {

    it('manually setting the value should emit ionChange once', async () => {
      const datetime = await page.find('ion-datetime[presentation="time"]');
      const didChange = await datetime.spyOnEvent('ionChange');

      await page.$eval('ion-datetime[presentation="time"]', (el: any) => {
        el.scrollIntoView();
      });

      await page.$eval('ion-datetime[presentation="time"]', (el: any) => {
        el.value = '06:02:40';
      });

      await page.waitForChanges();

      expect(didChange).toHaveReceivedEventTimes(1);
      expect(didChange).toHaveReceivedEventDetail({ value: '06:02:40' });
    });

  });

});
