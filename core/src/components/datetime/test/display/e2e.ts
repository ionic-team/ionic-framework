import { newE2EPage } from '@stencil/core/testing';

test('display', async () => {
  const page = await newE2EPage({
    url: '/src/components/datetime/test/display?ionic:_testing=true'
  });

  const screenshotCompares = [];

  await page.select('#presentation', 'date-time');
  await page.waitForChanges();

  screenshotCompares.push(await page.compareScreenshot());

  await page.select('#presentation', 'time-date');
  await page.waitForChanges();

  screenshotCompares.push(await page.compareScreenshot());

  await page.select('#presentation', 'time');
  await page.waitForChanges();

  screenshotCompares.push(await page.compareScreenshot());

  await page.select('#presentation', 'date');
  await page.waitForChanges();

  screenshotCompares.push(await page.compareScreenshot());

  await page.select('#size', 'cover');
  await page.select('#presentation', 'date-time');
  await page.waitForChanges();

  screenshotCompares.push(await page.compareScreenshot());

  await page.select('#presentation', 'time-date');
  await page.waitForChanges();

  screenshotCompares.push(await page.compareScreenshot());

  await page.select('#presentation', 'time');
  await page.waitForChanges();

  screenshotCompares.push(await page.compareScreenshot());

  await page.select('#presentation', 'date');
  await page.waitForChanges();

  screenshotCompares.push(await page.compareScreenshot());

  for (const screenshotCompare of screenshotCompares) {
    expect(screenshotCompare).toMatchScreenshot();
  }
});
