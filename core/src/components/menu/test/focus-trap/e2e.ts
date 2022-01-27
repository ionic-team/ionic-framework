import { newE2EPage } from '@stencil/core/testing';

const getActiveElementID = async (page) => {
  const activeElement = await page.evaluateHandle(() => document.activeElement);
  return await page.evaluate(el => el && el.id, activeElement);
}

test('menu: focus trap with overlays', async () => {
  const page = await newE2EPage({
    url: '/src/components/menu/test/focus-trap?ionic:_testing=true'
  });

  const ionDidOpen = await page.spyOnEvent('ionDidOpen');
  const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
  const ionModalDidDismiss= await page.spyOnEvent('ionModalDidDismiss');

  const menu = await page.find('ion-menu');
  await menu.callMethod('open');
  await ionDidOpen.next();

  expect(await getActiveElementID(page)).toEqual('open-modal-button');

  const openModal = await page.find('#open-modal-button');
  await openModal.click();
  await ionModalDidPresent.next();

  expect(await getActiveElementID(page)).toEqual('modal-element');

  const modal = await page.find('ion-modal');
  await modal.callMethod('dismiss');
  await ionModalDidDismiss.next();

  expect(await getActiveElementID(page)).toEqual('open-modal-button');
});

test('menu: focus trap with content inside overlays', async () => {
  const page = await newE2EPage({
    url: '/src/components/menu/test/focus-trap?ionic:_testing=true'
  });

  const ionDidOpen = await page.spyOnEvent('ionDidOpen');
  const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
  const ionModalDidDismiss= await page.spyOnEvent('ionModalDidDismiss');

  const menu = await page.find('ion-menu');
  await menu.callMethod('open');
  await ionDidOpen.next();

  expect(await getActiveElementID(page)).toEqual('open-modal-button');

  const openModal = await page.find('#open-modal-button');
  await openModal.click();
  await ionModalDidPresent.next();

  const button = await page.find('#other-button');
  await button.click();

  expect(await getActiveElementID(page)).toEqual('other-button');
});
