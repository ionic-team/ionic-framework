import { newE2EPage } from '@stencil/core/testing';

test('should calculate popover width automatically', async () => {
  const page = await newE2EPage({ url: '/src/components/popover/test/size?ionic:_testing=true' });

  const screenshotCompares = [];

  const trigger = await page.find('#auto-trigger');
  trigger.click();

  await page.waitForSelector('.auto-popover');
  const popover = await page.find('.auto-popover');
  await popover.waitForVisible();

  const triggerHandler = await page.$('#auto-trigger');
  const popoverContentHandle = await page.evaluateHandle(`document.querySelector('.auto-popover').shadowRoot.querySelector('.popover-content')`);
  const triggerBbox = await triggerHandler.boundingBox();
  const popoverBbox = await popoverContentHandle.boundingBox();
  expect(popoverBbox.width).not.toEqual(triggerBbox.width);

  screenshotCompares.push(await page.compareScreenshot());

  for (const screenshotCompare of screenshotCompares) {
    expect(screenshotCompare).toMatchScreenshot();
  }
});

test('should calculate popover width based on trigger width', async () => {
  const page = await newE2EPage({ url: '/src/components/popover/test/size?ionic:_testing=true' });

  const screenshotCompares = [];

  const trigger = await page.find('#cover-trigger');
  trigger.click();

  await page.waitForSelector('.cover-popover');
  const popover = await page.find('.cover-popover');
  await popover.waitForVisible();

  const triggerHandler = await page.$('#cover-trigger');
  const popoverContentHandle = await page.evaluateHandle(`document.querySelector('.cover-popover').shadowRoot.querySelector('.popover-content')`);
  const triggerBbox = await triggerHandler.boundingBox();
  const popoverBbox = await popoverContentHandle.boundingBox();
  expect(popoverBbox.width).toEqual(triggerBbox.width);

  screenshotCompares.push(await page.compareScreenshot());

  for (const screenshotCompare of screenshotCompares) {
    expect(screenshotCompare).toMatchScreenshot();
  }
});
