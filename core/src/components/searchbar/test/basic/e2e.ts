import { newE2EPage } from '@stencil/core/testing';

test('searchbar: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/searchbar/test/basic?ionic:_testing=true'
  });

  await page.waitFor(250);

  const compares = [];
  compares.push(await page.compareScreenshot());

  let searchbar = await page.find('#basic');
  await searchbar.callMethod('setFocus');

  await page.waitFor(250);
  searchbar = await page.find('#basic');
  expect(searchbar).toHaveClass('searchbar-has-focus');

  compares.push(await page.compareScreenshot('focused'));

  // No Cancel Button Searchbar
  searchbar = await page.find('#noCancel');
  await searchbar.callMethod('setFocus');

  await page.waitFor(250);
  searchbar = await page.find('#noCancel');
  expect(searchbar).toHaveClass('searchbar-has-focus');

  compares.push(await page.compareScreenshot('no cancel button, focused'));

  for (const compare of compares) {
    expect(compare).toMatchScreenshot();
  }
});

test('searchbar:rtl: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/searchbar/test/basic?ionic:_testing=true&rtl=true'
  });

  await page.waitFor(250);

  const compares = [];
  compares.push(await page.compareScreenshot());

  let searchbar = await page.find('#basic');
  await searchbar.callMethod('setFocus');

  await page.waitFor(250);
  searchbar = await page.find('#basic');
  expect(searchbar).toHaveClass('searchbar-has-focus');

  compares.push(await page.compareScreenshot('focused'));

  // No Cancel Button Searchbar
  searchbar = await page.find('#noCancel');
  await searchbar.callMethod('setFocus');

  await page.waitFor(250);
  searchbar = await page.find('#noCancel');
  expect(searchbar).toHaveClass('searchbar-has-focus');

  compares.push(await page.compareScreenshot('no cancel button, focused'));

  for (const compare of compares) {
    expect(compare).toMatchScreenshot();
  }
});
