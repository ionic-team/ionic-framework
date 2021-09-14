import { newE2EPage } from '@stencil/core/testing';

test('config', async () => {
  const page = await newE2EPage({
    url: '/src/utils/test/config?ionic:_testing=true'
  });

  let platforms = await page.evaluate(() => (window as any).Ionic.platforms);

  expect(platforms.includes('cordova')).toEqual(true);
  expect(platforms.includes('electron')).toEqual(true);
  expect(platforms.includes('pwa')).toEqual(false);
});
