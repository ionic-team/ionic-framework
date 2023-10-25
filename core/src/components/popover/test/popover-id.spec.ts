import { newSpecPage } from '@stencil/core/testing';

import { Backdrop } from '../../backdrop/backdrop';
import { Popover } from '../popover';

it('popover should be assigned an incrementing id', async () => {
  const page = await newSpecPage({
    components: [Popover, Backdrop],
    html: `<ion-popover is-open="true"></ion-popover>`,
  });
  let popover: HTMLIonPopoverElement;

  popover = page.body.querySelector('ion-popover')!;

  expect(popover).not.toBe(null);
  expect(popover.getAttribute('id')).toBe('ion-overlay-1');

  // Remove the popover from the DOM
  popover.remove();
  await page.waitForChanges();

  // Create a new popover to verify the id is incremented
  popover = document.createElement('ion-popover');
  popover.isOpen = true;
  page.body.appendChild(popover);
  await page.waitForChanges();

  popover = page.body.querySelector('ion-popover')!;

  expect(popover.getAttribute('id')).toBe('ion-overlay-2');

  // Presenting the same popover again should reuse the existing id

  popover.isOpen = false;
  await page.waitForChanges();
  popover.isOpen = true;
  await page.waitForChanges();

  popover = page.body.querySelector('ion-popover')!;

  expect(popover.getAttribute('id')).toBe('ion-overlay-2');
});
