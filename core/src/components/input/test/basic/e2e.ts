import { newE2EPage } from '@stencil/core/testing';

test('input: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/input/test/basic?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

test('input: full input', async () => {
  const page = await newE2EPage({
    url: '/src/components/input/test/basic?ionic:_testing=true'
  });

  const fullInput = await page.find('#fullInput');
  await fullInput.click();

  const fullItem = await page.find('#fullItem');
  expect(fullItem).toHaveClass('item-has-focus');

  const compare = await page.compareScreenshot('focused');
  expect(compare).toMatchScreenshot();
});

test('input: inset input', async () => {
  const page = await newE2EPage({
    url: '/src/components/input/test/basic?ionic:_testing=true'
  });

  const insetInput = await page.find('#insetInput');
  await insetInput.click();

  const insetItem = await page.find('#insetItem');
  expect(insetItem).toHaveClass('item-has-focus');

  const compare = await page.compareScreenshot('focused');
  expect(compare).toMatchScreenshot();
});

test('input: no lines input', async () => {
  const page = await newE2EPage({
    url: '/src/components/input/test/basic?ionic:_testing=true'
  });

  const noneInput = await page.find('#noneInput');
  await noneInput.click();

  const noneItem = await page.find('#noneItem');
  expect(noneItem).toHaveClass('item-has-focus');

  const compare = await page.compareScreenshot('focused');
  expect(compare).toMatchScreenshot();
});
