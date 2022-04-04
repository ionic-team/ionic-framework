import { newE2EPage } from '@stencil/core/testing';

describe('picker: basic', () => {
  it('should match existing screenshots', async () => {
    const page = await newE2EPage({
      url: '/src/components/picker/test/basic?ionic:_testing=true',
    });

    const compares = [];

    await page.click('#basic');

    await page.waitForEvent('ionPickerDidPresent');

    compares.push(await page.compareScreenshot('picker initial state'));

    await page.click('ion-picker .save-btn');

    await page.click('#basic');

    await page.waitForEvent('ionPickerDidPresent');

    compares.push(await page.compareScreenshot('picker opened with selected value'));

    for (const compare of compares) {
      expect(compare).toMatchScreenshot();
    }
  });
});
