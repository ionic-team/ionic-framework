import { newE2EPage } from '@stencil/core/testing';

test('tab-group: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/tab-group/test/basic?ionic:_testing=true'
  });

  let compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();

  const button2 = await page.find('.e2eTabTwoButton');
  await button2.click();
  compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();

  const button3 = await page.find('.e2eTabThreeButton');
  await button3.click();
  compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();

  const button4 = await page.find('.e2eTabFourButton');
  await button4.click();
  compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
