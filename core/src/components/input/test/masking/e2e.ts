import { newE2EPage } from '@stencil/core/testing';

test('input: masking', async () => {
  const page = await newE2EPage({
    url: '/src/components/input/test/masking?ionic:_testing=true'
  });

  const inputTrimmed = await page.find('#inputTrimmed');

  await inputTrimmed.click();

  await page.keyboard.type('S p a c e s');

  const currentValue = await page.$eval('#inputTrimmed', (el: any) => {
    return el.value;
  });

  expect(currentValue).toEqual('Spaces');

});
