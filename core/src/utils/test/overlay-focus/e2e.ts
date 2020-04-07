import { newE2EPage } from '@stencil/core/testing';

test('overlay: focus:modal', async () => {
  const page = await newE2EPage({
    url: '/src/utils/test/overlay-focus?ionic:_testing=true'
  });
  const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
  const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

  await page.click("#open-modal");
  await ionModalDidPresent.next();
  const activeEl = await getActiveElement(page);
  expect(activeEl.tagName).toEqual('ION-BUTTON');
  expect(activeEl.id).toEqual('close');

  await page.click('#close');
  await ionModalDidDismiss.next();

  await page.click("#open-input-modal");
  await ionModalDidPresent.next();
  const activeElInput = await getActiveElement(page);
  expect(activeElInput.tagName).toEqual('INPUT');

  await page.click('#close');
  await ionModalDidDismiss.next();

  await page.click("#open-button-modal");
  await ionModalDidPresent.next();
  const activeElButton = await getActiveElement(page);
  expect(activeElButton.tagName).toEqual('ION-BUTTON');
  expect(activeElButton.role).toEqual('cancel');
});

test('overlay: focus:action-sheet', async () => {
  const page = await newE2EPage({
    url: '/src/utils/test/overlay-focus?ionic:_testing=true'
  });
  const ionActionSheetDidPresent = await page.spyOnEvent('ionActionSheetDidPresent');

  await page.click("#open-action-sheet");
  await ionActionSheetDidPresent.next();
  const activeEl = await getActiveElement(page);
  expect(activeEl.tagName).toEqual('BUTTON');
  expect(activeEl.role).toEqual('cancel');
});

test('overlay: focus:popover', async () => {
  const page = await newE2EPage({
    url: '/src/utils/test/overlay-focus?ionic:_testing=true'
  });
  const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

  await page.click("#open-popover");
  await ionPopoverDidPresent.next();
  const activeEl = await getActiveElement(page);
  expect(activeEl.tagName).toEqual('ION-BUTTON');
  expect(activeEl.id).toEqual('close');
});

const getActiveElement = async (page: E2EPage) => {
  const el = await page.evaluateHandle(() => {
    const { tagName, id } = document.activeElement;
    return { tagName, id, role: document.activeElement.getAttribute('role') };
  });
  return await el.jsonValue();
}
