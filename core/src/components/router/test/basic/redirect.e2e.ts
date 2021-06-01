import { newE2EPage } from '@stencil/core/testing';

test('redirect should support query string', async () => {
  const page = await newE2EPage({
    url: '/src/components/router/test/basic#/redirect-to-three?ionic:_testing=true'
  });

  await page.waitForChanges();

  const url = await page.url();
  expect(url).toContain('#/three?has_query_string=true');  
});