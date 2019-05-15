import { newE2EPage } from '@stencil/core/testing';

test('slides: prevent-default', async () => {
  // For this specific test, _testing=false to import tap-click in app.tsx
  const page = await newE2EPage({
    url: '/src/components/slides/test/prevent-default?ionic:_testing=false'
  });

  const screenshotCompares = [];

  screenshotCompares.push(await page.compareScreenshot());

  const scroller = await page.find('#scrollDownButton');
  const button = await page.find('#changeBackgroundButton');
  const contentWithBackground = await page.find('#contentWithBackground');

  await page.waitFor(500);

  await scroller.click();
  await page.waitFor(500);

  screenshotCompares.push(await page.compareScreenshot('scroll down button'));

  await button.click();

  screenshotCompares.push(await page.compareScreenshot('change background'));

  expect(contentWithBackground).toHaveClasses(['blueBackground']);

  for (const screenshotCompare of screenshotCompares) {
    expect(screenshotCompare).toMatchScreenshot();
  }
});
