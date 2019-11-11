import { newE2EPage } from '@stencil/core/testing';

test('tabs: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/tabs/test/standalone?ionic:_testing=true'
  });

  const compares = [];

  // Initial page load
  compares.push(await page.compareScreenshot());

  let tabButton = await page.find('#tab-button-tab-one');
  await tabButton.click();

  compares.push(await page.compareScreenshot(`tab one`));

  tabButton = await page.find('#tab-button-tab-two');
  await tabButton.click();

  compares.push(await page.compareScreenshot(`tab two`));

  for (const compare of compares) {
    expect(compare).toMatchScreenshot();
  }
});
