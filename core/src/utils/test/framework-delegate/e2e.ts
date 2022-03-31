import { newE2EPage } from '@stencil/core/testing';

test('framework-delegate: should present modal already at ion-app root', async () => {
  const page = await newE2EPage({ url: '/src/utils/test/framework-delegate?ionic:_testing=true' });

  const button = await page.find('#button-inline-root');
  await button.click();

  const modal = await page.find('#inline-root');
  expect(modal).not.toBe(null);
  await modal.waitForVisible();

});

test('framework-delegate: should present modal in content', async () => {
  const page = await newE2EPage({ url: '/src/utils/test/framework-delegate?ionic:_testing=true' });

  const button = await page.find('#button-inline-content');
  await button.click();

  const modal = await page.find('#inline-content');
  expect(modal).not.toBe(null);
  await modal.waitForVisible();
});

test('framework-delegate: should present modal via controller', async () => {
  const page = await newE2EPage({ url: '/src/utils/test/framework-delegate?ionic:_testing=true' });

  const button = await page.find('#button-controller');
  await button.click();

  const modal = await page.find('#controller');
  expect(modal).not.toBe(null);
  await modal.waitForVisible();
});
