import { newE2EPage } from '@stencil/core/testing';
import { getActiveElementParent } from '../utils';

test('overlays: hardware back button: should dismiss a presented overlay', async () => {
  const page = await newE2EPage({ url: '/src/utils/test/overlays?ionic:_testing=true' });

  const createAndPresentButton = await page.find('#create-and-present');

  const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
  const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

  await createAndPresentButton.click()
  const modal = await page.find('ion-modal');
  expect(modal).not.toBe(null);

  await ionModalDidPresent.next();

  const simulateButton = await modal.find('#modal-simulate');
  expect(simulateButton).not.toBe(null);

  await simulateButton.click();

  await ionModalDidDismiss.next();

  await page.waitForSelector('ion-modal', { hidden: true })
});

test('overlays: hardware back button: should dismiss the presented overlay, even though another hidden modal was added last', async () => {
  const page = await newE2EPage({ url: '/src/utils/test/overlays?ionic:_testing=true' });

  const createAndPresentButton = await page.find('#create-and-present');

  const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
  const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

  await createAndPresentButton.click();
  const modal = await page.find('ion-modal');
  expect(modal).not.toBe(null);

  await ionModalDidPresent.next();

  const createButton = await page.find('#modal-create');
  await createButton.click();

  const modals = await page.$$('ion-modal');
  expect(modals.length).toEqual(2);

  expect(await modals[0].evaluate(node => node.classList.contains('overlay-hidden'))).toEqual(false);
  expect(await modals[1].evaluate(node => node.classList.contains('overlay-hidden'))).toEqual(true);

  const simulateButton = await modal.find('#modal-simulate');
  expect(simulateButton).not.toBe(null);

  await simulateButton.click();

  expect(await modals[0].evaluate(node => node.classList.contains('overlay-hidden'))).toEqual(true);
  expect(await modals[1].evaluate(node => node.classList.contains('overlay-hidden'))).toEqual(true);
});

test('overlays: Esc: should dismiss a presented overlay', async () => {
  const page = await newE2EPage({ url: '/src/utils/test/overlays?ionic:_testing=true' });

  const createAndPresentButton = await page.find('#create-and-present');

  const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
  const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

  await createAndPresentButton.click()
  const modal = await page.find('ion-modal');
  expect(modal).not.toBe(null);

  await ionModalDidPresent.next();

  await page.keyboard.press('Escape');

  await ionModalDidDismiss.next();

  await page.waitForSelector('ion-modal', { hidden: true })
});


test('overlays: Esc: should dismiss the presented overlay, even though another hidden modal was added last', async () => {
  const page = await newE2EPage({ url: '/src/utils/test/overlays?ionic:_testing=true' });

  const createAndPresentButton = await page.find('#create-and-present');

  const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
  const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

  await createAndPresentButton.click();
  const modal = await page.find('ion-modal');
  expect(modal).not.toBe(null);

  await ionModalDidPresent.next();

  const createButton = await page.find('#modal-create');
  await createButton.click();

  const modals = await page.$$('ion-modal');
  expect(modals.length).toEqual(2);

  await page.keyboard.press('Escape');

  await page.waitForSelector('ion-modal#ion-overlay-1', { hidden: true });
});

test('overlays: Nested: should dismiss the top overlay', async () => {
  const page = await newE2EPage({ url: '/src/utils/test/overlays?ionic:_testing=true' });

  const createNestedButton = await page.find('#create-nested');
  const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

  await createNestedButton.click();

  await ionModalDidPresent.next();

  const modal = await page.find('ion-modal');
  expect(modal).not.toBe(null);

  const dismissNestedOverlayButton = await page.find('#dismiss-modal-nested-overlay');
  const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

  await dismissNestedOverlayButton.click();

  await ionModalDidDismiss.next();

  const modals = await page.$$('ion-modal');
  expect(modals.length).toEqual(0);
});

test('toast should not cause focus trapping', async () => {
  const page = await newE2EPage({ url: '/src/utils/test/overlays?ionic:_testing=true' });
  const ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');

  await page.click('#create-and-present-toast');
  await ionToastDidPresent.next();

  await page.click('#root-input');

  const parentEl = await getActiveElementParent(page);
  expect(parentEl.id).toEqual('root-input');
});

test('toast should not cause focus trapping even when opened from a focus trapping overlay', async () => {
  const page = await newE2EPage({ url: '/src/utils/test/overlays?ionic:_testing=true' });
  const ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');
  const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

  await page.click('#create-and-present');
  await ionModalDidPresent.next();

  await page.click('#modal-toast');
  await ionToastDidPresent.next();

  await page.click('.modal-input');

  const parentEl = await getActiveElementParent(page);
  expect(parentEl.className).toContain('modal-input-0');
});

test('focus trapping should only run on the top-most overlay', async () => {
  const page = await newE2EPage({ url: '/src/utils/test/overlays?ionic:_testing=true' });
  const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

  await page.click('#create-and-present');
  await ionModalDidPresent.next();

  await page.click('.modal-0 .modal-input');

  const parentEl = await getActiveElementParent(page);
  expect(parentEl.className).toContain('modal-input-0');

  await page.click('#modal-create-and-present');
  await ionModalDidPresent.next();

  await page.click('.modal-1 .modal-input');

  const parentElAgain = await getActiveElementParent(page);
  expect(parentElAgain.className).toContain('modal-input-1');
})
