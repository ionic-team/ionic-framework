import { newE2EPage } from '@stencil/core/testing';

async function openAlert(selector: string, rtl = false) {
  const pageUrl = rtl
   ? '/src/components/alert/test/basic?ionic:_testing=true&rtl=true'
   : '/src/components/alert/test/basic?ionic:_testing=true';
  const page = await newE2EPage({
    url: pageUrl
  });

  await page.click(selector);

  let alert = await page.find('ion-alert');
  expect(alert).not.toBe(null);
  await alert.waitForVisible();
  await page.waitFor(250);

  const compare = rtl
    ? await page.compareScreenshot('rtl')
    : await page.compareScreenshot();
  expect(compare).toMatchScreenshot();

  await alert.callMethod('dismiss');
  await alert.waitForNotVisible();

  alert = await page.find('ion-alert');
  expect(alert).toBe(null);
}

test(`alert: basic`, async () => {
  await openAlert('#basic');
});

test(`alert: basic, long message`, async () => {
  await openAlert('#longMessage');
});

test(`alert: basic, multiple buttons`, async () => {
  await openAlert('#multipleButtons');
});

test(`alert: basic, no message`, async () => {
  await openAlert('#noMessage');
});

test(`alert: basic, confirm`, async () => {
  await openAlert('#confirm');
});

test(`alert: basic, prompt`, async () => {
  await openAlert('#prompt');
});

test(`alert: basic, radio`, async () => {
  await openAlert('#radio');
});

test(`alert: basic, checkbox`, async () => {
  await openAlert('#checkbox');
});

// Right to Left tests
// ------------------------------------------------------

test(`alert: basic`, async () => {
  await openAlert('#basic', true);
});

test(`alert: basic, long message`, async () => {
  await openAlert('#longMessage', true);
});

test(`alert: basic, multiple buttons`, async () => {
  await openAlert('#multipleButtons', true);
});

test(`alert: basic, no message`, async () => {
  await openAlert('#noMessage', true);
});

test(`alert: basic, confirm`, async () => {
  await openAlert('#confirm', true);
});

test(`alert: basic, prompt`, async () => {
  await openAlert('#prompt', true);
});

test(`alert: basic, radio`, async () => {
  await openAlert('#radio', true);
});

test(`alert: basic, checkbox`, async () => {
  await openAlert('#checkbox', true);
});
