import { newE2EPage } from '@stencil/core/testing';

it('datetime: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/datetime/test/basic?ionic:_testing=true'
  });

  console.log(1)

  let compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();

  console.log(2)

  const datetime = await page.find('#customPickerOptions');
  await datetime.click();

  console.log(3)

  const picker = await page.find('ion-picker');
  await picker.waitForVisible();

  console.log(4)

  compare = await page.compareScreenshot('should open custom picker');
  expect(compare).toMatchScreenshot();

  console.log(5)
});
