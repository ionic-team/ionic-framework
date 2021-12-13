import { newE2EPage } from '@stencil/core/testing';

test('should properly set readonly on child accordions', async () => {
  const page = await newE2EPage({
    html: `
      <ion-accordion-group animated="false">
        <ion-accordion>
          <ion-item slot="header">Label</ion-item>
          <div slot="content">Content</div>
        </ion-accordion>
      </ion-accordion-group>
    `
  });

  const accordion = await page.find('ion-accordion');
  const value = await accordion.getProperty('readonly');

  expect(value).toBe(false);

  await page.$eval('ion-accordion-group', (el: HTMLIonAccordionGroupElement) => {
    el.readonly = true;
  });

  await page.waitForChanges();

  const valueAgain = await accordion.getProperty('readonly');
  expect(valueAgain).toBe(true);
});

test('should properly set disabled on child accordions', async () => {
  const page = await newE2EPage({
    html: `
      <ion-accordion-group animated="false">
        <ion-accordion>
          <ion-item slot="header">Label</ion-item>
          <div slot="content">Content</div>
        </ion-accordion>
      </ion-accordion-group>
    `
  });

  const accordion = await page.find('ion-accordion');
  const value = await accordion.getProperty('disabled');

  expect(value).toBe(false);

  await page.$eval('ion-accordion-group', (el: HTMLIonAccordionGroupElement) => {
    el.disabled = true;
  });

  await page.waitForChanges();

  const valueAgain = await accordion.getProperty('disabled');
  expect(valueAgain).toBe(true);
});
