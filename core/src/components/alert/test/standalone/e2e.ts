import { newE2EPage } from '@stencil/core/testing';

async function openAlert(selector: string) {
  const page = await newE2EPage({
    url: '/src/components/alert/test/standalone?ionic:_testing=true'
  });

  await page.click(selector);

  let alert = await page.find('ion-alert');
  expect(alert).not.toBe(null);
  await alert.waitForVisible();
  await page.waitFor(250);

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();

  await alert.callMethod('dismiss');
  await alert.waitForNotVisible();

  alert = await page.find('ion-alert');
  expect(alert).toBe(null);
}

test(`alert: standalone`, async () => {
  await openAlert('#basic');
});

test(`alert: standalone, long message`, async () => {
  await openAlert('#longMessage');
});

test(`alert: standalone, multiple buttons`, async () => {
  await openAlert('#multipleButtons');
});

test(`alert: standalone, no message`, async () => {
  await openAlert('#noMessage');
});

test(`alert: standalone, confirm`, async () => {
  await openAlert('#confirm');
});

test(`alert: standalone, prompt`, async () => {
  await openAlert('#prompt');
});

test(`alert: standalone, radio`, async () => {
  await openAlert('#radio');
});

test(`alert: standalone, checkbox`, async () => {
  await openAlert('#checkbox');
});
