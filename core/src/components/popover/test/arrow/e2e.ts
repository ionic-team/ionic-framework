import { newE2EPage } from '@stencil/core/testing';

const popoverNames =  [
  'top-auto',
  'right-auto',
  'bottom-auto',
  'left-auto',
  'start-auto',
  'end-auto',
  'bottom-auto-center',
  'bottom-auto-end',
  'top-cover',
  'right-cover',
  'bottom-cover',
  'left-cover',
  'start-cover',
  'end-cover',
  'bottom-cover-center',
  'bottom-cover-end'
];

for (const popoverName of popoverNames) {
  test(`popover - arrow - ${popoverName}`, async () => {
    await testPopover(popoverName, false);
    await testPopover(popoverName, true);
  });
}

const testPopover = async (popoverName, isRTL = false) => {
  const rtl = isRTL ? '&rtl=true' : '';
  const page = await newE2EPage({ url: `/src/components/popover/test/arrow?ionic:_testing=true${rtl}` });

  const POPOVER_CLASS = `${popoverName}-popover`;
  const TRIGGER_ID = `${popoverName}-trigger`;
  const screenshotCompares = [];

  const trigger = await page.find(`#${TRIGGER_ID}`);

  await page.evaluate((TRIGGER_ID) => {
    const trigger = document.querySelector(`#${TRIGGER_ID}`);
    trigger.scrollIntoView({ block: 'center' });
  }, TRIGGER_ID);

  trigger.click();

  await page.waitForSelector(`.${POPOVER_CLASS}`);
  const popover = await page.find(`.${POPOVER_CLASS}`);
  await popover.waitForVisible();

  screenshotCompares.push(await page.compareScreenshot());

  for (const screenshotCompare of screenshotCompares) {
    expect(screenshotCompare).toMatchScreenshot();
  }
}
