import { E2EElement, newE2EPage } from '@stencil/core/testing';

test('card: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/card/test/basic?ionic:_testing=true'
  });

  await checkMode(await page.find('ion-card'));
  await checkMode(await page.find('ion-card-content'));
  await checkMode(await page.find('ion-card-header'));
  await checkMode(await page.find('ion-card-subtitle'));
  await checkMode(await page.find('ion-card-title'));

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

// Given an element of type E2EElement, get the node name of the
// element and the current mode to verify the mode class exists
//
// Example:
// await checkMode(await page.find('ion-card-content'))
// ios => expect(el).toHaveClass(`card-content-ios`);
// mode => expect(el).toHaveClass(`card-content-md`);
// -----------------------------------------------------------------
async function checkMode(el: E2EElement, name?: string) {
  // If passed a name to use, use that, else grab the nodeName
  // of the element and remove the ion prefix to get the class name
  const selector = name ? name : el.nodeName.toLowerCase().replace('ion-', '');
  const mode = await el.getProperty('mode');
  expect(el).toHaveClass(`${selector}-${mode}`);
  console.log('selector', selector, 'mode', mode);
}
