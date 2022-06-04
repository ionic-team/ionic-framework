import { newE2EPage } from '@stencil/core/testing';

test('display', async () => {
  const page = await newE2EPage({
    url: '/src/components/datetime/test/display?ionic:_testing=true',
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
    url: '/src/components/datetime/test/display?ionic:_testing=true',
  });
  const ionWorkingPartsDidChange = await page.spyOnEvent('ionWorkingPartsDidChange', 'document');
  let calendarMonthYear;

  await page.select('#presentation', 'date-time');
  await page.waitForChanges();

  await page.select('#presentation', 'time-date');
  await page.waitForChanges();

  const nextMonthButton = await page.find('ion-datetime >>> .calendar-next-prev ion-button + ion-button');
  await nextMonthButton.click();
  await page.waitForChanges();

  await ionWorkingPartsDidChange.next();

  calendarMonthYear = await page.find('ion-datetime >>> .calendar-month-year');

  expect(calendarMonthYear.textContent).toContain('March 2022');

  // ensure it still works if presentation is changed more than once
  await page.select('#presentation', 'date-time');
  await page.waitForChanges();

  const prevMonthButton = await page.find('ion-datetime >>> .calendar-next-prev ion-button:first-child');
  await prevMonthButton.click();
  await page.waitForChanges();

  await ionWorkingPartsDidChange.next();

  calendarMonthYear = await page.find('ion-datetime >>> .calendar-month-year');

  expect(calendarMonthYear.textContent).toContain('February 2022');
});
