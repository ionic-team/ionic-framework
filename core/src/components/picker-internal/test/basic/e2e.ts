import { newE2EPage } from '@stencil/core/testing';

test('picker', async () => {
  const page = await newE2EPage({
    url: '/src/components/picker-internal/test/basic?ionic:_testing=true',
  });

  const screenshotCompares = [];

  screenshotCompares.push(await page.compareScreenshot());

  const firstColumn = await page.find('ion-picker-column-internal#first');
  firstColumn.setProperty('value', 'serverless');
  await page.waitForChanges();
  screenshotCompares.push(await page.compareScreenshot());

  for (const screenshotCompare of screenshotCompares) {
    expect(screenshotCompare).toMatchScreenshot();
  }
});

test('picker - popover', async () => {
  const page = await newE2EPage({
    url: '/src/components/picker-internal/test/basic?ionic:_testing=true',
  });

  const screenshotCompares = [];

  const popoverButton = await page.find('#popover');
  popoverButton.click();

  const popover = await page.find('ion-popover');
  expect(popover).not.toBe(null);
  await popover.waitForVisible();

  screenshotCompares.push(await page.compareScreenshot());

  for (const screenshotCompare of screenshotCompares) {
    expect(screenshotCompare).toMatchScreenshot();
  }
});

test('picker - modal', async () => {
  const page = await newE2EPage({
    url: '/src/components/picker-internal/test/basic?ionic:_testing=true',
  });

  const screenshotCompares = [];

  const modalButton = await page.find('#modal');
  modalButton.click();

  const modal = await page.find('ion-modal');
  expect(modal).not.toBe(null);
  await modal.waitForVisible();

  screenshotCompares.push(await page.compareScreenshot());

  for (const screenshotCompare of screenshotCompares) {
    expect(screenshotCompare).toMatchScreenshot();
  }
});
