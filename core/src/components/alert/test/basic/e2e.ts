import { newE2EPage } from '@stencil/core/testing';

async function openAlert(selector: string) {
  const page = await newE2EPage({
    url: '/src/components/alert/test/basic?ionic:_testing=true'
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

async function openRTLAlert(selector: string) {
  const page = await newE2EPage({
    url: '/src/components/alert/test/basic?ionic:_testing=true&rtl=true'
  });

  await page.click(selector);

  let alert = await page.find('ion-alert');
  expect(alert).not.toBe(null);
  await alert.waitForVisible();
  await page.waitFor(250);

  const compare = await page.compareScreenshot('rtl');
  expect(compare).toMatchScreenshot();

  await alert.callMethod('dismiss');
  await alert.waitForNotVisible();

  alert = await page.find('ion-alert');
  expect(alert).toBe(null);
}

test(`alert: basic`, async () => {
  await openAlert('#basic');
  await openRTLAlert('#basic');
});

test(`alert: basic, long message`, async () => {
  await openAlert('#longMessage');
  await openRTLAlert('#longMessage');
});

test(`alert: basic, multiple buttons`, async () => {
  await openAlert('#multipleButtons');
  await openRTLAlert('#multipleButtons');
});

test(`alert: basic, no message`, async () => {
  await openAlert('#noMessage');
  await openRTLAlert('#noMessage');
});

test(`alert: basic, confirm`, async () => {
  await openAlert('#confirm');
  await openRTLAlert('#confirm');
});

test(`alert: basic, prompt`, async () => {
  await openAlert('#prompt');
  await openRTLAlert('#prompt');
});

test(`alert: basic, radio`, async () => {
  await openAlert('#radio');
  await openRTLAlert('#radio');
});

test(`alert: basic, checkbox`, async () => {
  await openAlert('#checkbox');
  await openRTLAlert('#checkbox');
});
