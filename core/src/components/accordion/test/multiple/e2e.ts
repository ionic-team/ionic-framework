import { newE2EPage } from '@stencil/core/testing';

test('accordion: multiple - open', async () => {
  const page = await newE2EPage({
    url: '/src/components/accordion/test/multiple?ionic:_testing=true'
  });

  const screenshotCompares = [];

  screenshotCompares.push(await page.compareScreenshot());

  const accordionGroup = await page.find('ion-accordion-group');
  const diningAccordion = await page.find('ion-accordion[value="dining"] ion-item[slot="header"]');
  const attractionsAccordion = await page.find('ion-accordion[value="attractions"] ion-item[slot="header"]');

  const groupValue = await accordionGroup.getProperty('value');
  expect(groupValue).toEqual('attractions');

  await diningAccordion.click();
  await page.waitForChanges();

  const groupValueAgain = await accordionGroup.getProperty('value');
  expect(groupValueAgain).toEqual(['attractions', 'dining']);

  screenshotCompares.push(await page.compareScreenshot());

  for (const screenshotCompare of screenshotCompares) {
    expect(screenshotCompare).toMatchScreenshot();
  }
});

test('accordion: multiple - close', async () => {
  const page = await newE2EPage({
    url: '/src/components/accordion/test/multiple?ionic:_testing=true'
  });

  const screenshotCompares = [];

  screenshotCompares.push(await page.compareScreenshot());

  const accordionGroup = await page.find('ion-accordion-group');
  const attractionsAccordion = await page.find('ion-accordion[value="attractions"] ion-item[slot="header"]');

  await attractionsAccordion.click();
  await page.waitForChanges();

  const groupValue = await accordionGroup.getProperty('value');
  expect(groupValue).toEqual([]);

  screenshotCompares.push(await page.compareScreenshot());

  for (const screenshotCompare of screenshotCompares) {
    expect(screenshotCompare).toMatchScreenshot();
  }
});
