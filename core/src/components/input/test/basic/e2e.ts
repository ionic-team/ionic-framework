import { newE2EPage } from '@stencil/core/testing';

test('input: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/input/test/basic?ionic:_testing=true',
  });

  const compares = [];

  compares.push(await page.compareScreenshot());

  const fullInput = await page.find('#fullInput');
  await fullInput.click();

  const fullItem = await page.find('#fullItem');
  expect(fullItem).toHaveClass('item-has-focus');

  compares.push(await page.compareScreenshot('full input focused'));

  const insetInput = await page.find('#insetInput');
  await insetInput.click();

  const insetItem = await page.find('#insetItem');
  expect(insetItem).toHaveClass('item-has-focus');

  compares.push(await page.compareScreenshot('inset input focused'));

  const noneInput = await page.find('#noneInput');
  await noneInput.click();

  const noneItem = await page.find('#noneItem');
  expect(noneItem).toHaveClass('item-has-focus');

  compares.push(await page.compareScreenshot('no lines input focused'));

  for (const compare of compares) {
    expect(compare).toMatchScreenshot();
  }
});

test('input: basic should not error on input', async () => {
  const page = await newE2EPage({
    url: '/src/components/input/test/basic?ionic:_testing=true',
  });

  const errors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  const inputs = await page.findAll('ion-input');

  for (const input of inputs) {
    await input.click();
    await input.type('letters and 12345');
  }

  expect(errors.length).toEqual(0);
});
