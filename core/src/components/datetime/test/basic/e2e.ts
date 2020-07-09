import { newE2EPage } from '@stencil/core/testing';

const getActiveElementText = async (page) => {
  const activeElement = await page.evaluateHandle(() => document.activeElement);
  return await page.evaluate(el => el && el.textContent, activeElement);
}

test('datetime/picker: focus trap', async () => {
  const page = await newE2EPage({ url: '/src/components/datetime/test/basic?ionic:_testing=true' });

  await page.click('#datetime-part');
  await page.waitForSelector('#datetime-part');

  let datetime = await page.find('ion-datetime');

  expect(datetime).not.toBe(null);
  await datetime.waitForVisible();

  // TODO fix
  await page.waitFor(100);

  await page.keyboard.press('Tab');

  const activeElementText = await getActiveElementText(page);
  expect(activeElementText).toEqual('Cancel');

  await page.keyboard.down('Shift');
  await page.keyboard.press('Tab');
  await page.keyboard.up('Shift');

  const activeElementTextTwo = await getActiveElementText(page);
  expect(activeElementTextTwo).toEqual('1920');

  await page.keyboard.press('Tab');

  const activeElementTextThree = await getActiveElementText(page);
  expect(activeElementTextThree).toEqual('Cancel');
});

test('datetime: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/datetime/test/basic?ionic:_testing=true'
  });

  let compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();

  const datetime = await page.find('#customPickerOptions');
  await datetime.waitForVisible();
  await datetime.click();

  const picker = await page.find('ion-picker');
  await picker.waitForVisible();
  await page.waitFor(250);

  compare = await page.compareScreenshot('should open custom picker');
  expect(compare).toMatchScreenshot();
});

test('datetime: basic-rtl', async () => {
  const page = await newE2EPage({
    url: '/src/components/datetime/test/basic?ionic:_testing=true&rtl=true'
  });

  const datetime = await page.find('#customPickerOptions');
  await datetime.click();

  const picker = await page.find('ion-picker');
  await picker.waitForVisible();
  await page.waitFor(250);

  const compare = await page.compareScreenshot('should open custom picker');
  expect(compare).toMatchScreenshot();
});
