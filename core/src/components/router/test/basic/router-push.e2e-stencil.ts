import { newE2EPage } from '@stencil/core/testing';

test('push should support relative path', async () => {
  const page = await newE2EPage({
    url: '/src/components/router/test/basic#/two/three/hola?ionic:_testing=true'
  });
  await page.waitForChanges();

  const backButton = await page.$('#btn-rel');
  await backButton.click();
  await page.waitForChanges();

  const url = await page.url();
  expect(url).toContain('#/two/three/relative?param=1');  
});

test('push should support absolute path', async () => {
  const page = await newE2EPage({
    url: '/src/components/router/test/basic#/two/three/hola?ionic:_testing=true'
  });
  await page.waitForChanges();

  const backButton = await page.$('#btn-abs');
  await backButton.click();
  await page.waitForChanges();

  const url = await page.url();
  expect(url).toContain('#/two/three/absolute');  
});