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

test('month selection should work after changing presentation', async () => {
  const page = await newE2EPage({
    url: '/src/components/datetime/test/display?ionic:_testing=true'
  });
  const ionWorkingPartsDidChange = await page.spyOnEvent('ionWorkingPartsDidChange');

  await page.select('#presentation', 'date-time');
  await page.waitForChanges();

  await page.select('#presentation', 'time-date');
  await page.waitForChanges();

  const nextMonthButton = await page.find('ion-datetime >>> .calendar-next-prev ion-button + ion-button');
  await nextMonthButton.click();

  const result = await ionWorkingPartsDidChange.next();
  const newWorkingParts = result.value.detail;
  expect(newWorkingParts.month).toEqual(3);
  
  // ensure it still works if presentation is changed more than once
  await page.select('#presentation', 'date-time');
  await page.waitForChanges();

  const prevMonthButton = await page.find('ion-datetime >>> .calendar-next-prev ion-button:first-child');
  await prevMonthButton.click();

  const ionWorkingPartsDidChange2 = await page.spyOnEvent('ionWorkingPartsDidChange');
  const result2 = await ionWorkingPartsDidChange2.next();
  const newWorkingParts2 = result2.value.detail;
  expect(newWorkingParts2.month).toEqual(2);
});