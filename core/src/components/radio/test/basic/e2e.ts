import { newE2EPage } from '@stencil/core/testing';

test('radio: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/radio/test/basic?ionic:_testing=true',
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();

  const groupedRadio = await page.find('#groupedRadio');
  await groupedRadio.click();
  expect(groupedRadio).toHaveClass('radio-checked');

  const ungroupedRadio = await page.find('#ungroupedRadio');
  await ungroupedRadio.click();
  expect(ungroupedRadio).toHaveClass('radio-checked');
});

test('radio:rtl: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/radio/test/basic?ionic:_testing=true&rtl=true',
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
