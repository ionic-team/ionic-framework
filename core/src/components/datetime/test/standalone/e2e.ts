import { newE2EPage } from '@stencil/core/testing';

it('datetime: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/datetime/test/standalone?ionic:_testing=true'
  });

  let compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();

  const datetime = await page.find('#basic');
  await datetime.click();
  await page.waitForSelector('ion-picker.hydrated');

  const picker = await page.find('ion-picker');
  await picker.waitForVisible();

  compare = await page.compareScreenshot('should open basic picker');
  expect(compare).toMatchScreenshot();

  const octoberOpt = await page.find({ text: 'October' });
  await octoberOpt.click();
  await page.waitFor(500);

  compare = await page.compareScreenshot('should click "October" option');
  expect(compare).toMatchScreenshot();
});
