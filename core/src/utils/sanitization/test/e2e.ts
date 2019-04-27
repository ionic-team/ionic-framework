import { newE2EPage } from '@stencil/core/testing';

test('sanitization:', async done => {

  const page = await newE2EPage({
    url: '/src/utils/sanitization/test?ionic:_testing=true'
  });

  page.on('pageerror', (err: any) => {
    if (err.message.includes('sanitizeFailed')) {
      done.fail(new Error('Failed to properly sanitize'));
    }
  });

  await page.click('#testA');
  await page.click('#testB');
  await page.click('#testC');
  await page.click('#testD');
  await page.click('#testE');
  await page.click('#testF');
  await page.click('#testG');
  await page.click('#testH');

  done();

});
