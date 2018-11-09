import { newE2EPage } from '@stencil/core/testing';

test('menu: basic', async () => {

  const page = await newE2EPage({
    url: '/src/components/menu/test/basic?ionic:_testing=true'
  });

  const start = await page.find('ion-menu[side="start"]');
  expect(start).toHaveClasses([
    'menu-type-overlay',
    'menu-enabled',
    'menu-side-start'
  ]);

  await start.callMethod('open');
  expect(await page.compareScreenshot('start menu')).toMatchScreenshot();
  await start.callMethod('close');

  const end = await page.find('ion-menu[side="end"]');
  expect(end).toHaveClasses([
    'menu-type-push',
    'menu-enabled',
    'menu-side-end'
  ]);

  await end.callMethod('open');
  expect(await page.compareScreenshot('end menu')).toMatchScreenshot();
});
