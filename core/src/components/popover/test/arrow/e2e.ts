import { newE2EPage } from '@stencil/core/testing';

test('popover - arrow side: top', async () => {
  await testPopover('top', false);
});

test('popover - arrow side: right', async () => {
  await testPopover('right', false);
});

test('popover - arrow side: bottom', async () => {
  await testPopover('bottom', false);
});

test('popover - arrow side: left', async () => {
  await testPopover('left', false);
});

test('popover - arrow side: start', async () => {
  await testPopover('start', false);
});

test('popover - arrow side: end', async () => {
  await testPopover('end', false);
});

test('popover - arrow side: start, rtl', async () => {
  await testPopover('start', true);
});

test('popover - arrow side: end, rtl', async () => {
  await testPopover('end', true);
});

const testPopover = async (side: string, isRTL = false) => {
  const rtl = isRTL ? '&rtl=true' : '';
  const page = await newE2EPage({ url: `/src/components/popover/test/arrow?ionic:_testing=true${rtl}` });

  const POPOVER_CLASS = `${side}-popover`;
  const TRIGGER_ID = `${side}-trigger`;
  const screenshotCompares = [];

  const trigger = await page.find(`#${TRIGGER_ID}`);

  await page.evaluate((POPOVER_TRIGGER_ID) => {
    const popoverTrigger = document.querySelector(`#${POPOVER_TRIGGER_ID}`);
    popoverTrigger?.scrollIntoView({ block: 'center' });
  }, TRIGGER_ID);

  trigger.click();

  await page.waitForSelector(`.${POPOVER_CLASS}`);
  const popover = await page.find(`.${POPOVER_CLASS}`);
  await popover.waitForVisible();

  screenshotCompares.push(await page.compareScreenshot());

  for (const screenshotCompare of screenshotCompares) {
    expect(screenshotCompare).toMatchScreenshot();
  }
};
