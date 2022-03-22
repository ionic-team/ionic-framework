import { newE2EPage } from '@stencil/core/testing';

test('router: guards - guards should be run on initial load', async () => {
  const page = await newE2EPage({
    url: '/src/components/router/test/guards#/guard-initial-page?ionic:_testing=true'
  });

  await page.waitForChanges();

  await checkUrl(page, '#/child/1');
});

const checkUrl = async (page, url: string) => {
  const getUrl = await page.url();
  expect(getUrl).toContain(url);
}