import { newSpecPage } from '@stencil/core/testing';

import { Popover } from '../popover';
import { h } from '@stencil/core';

describe('popover: id', () => {
  it('popover should be assigned an incrementing id', async () => {
    const page = await newSpecPage({
      components: [Popover],
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

  it('should not overwrite the id set in htmlAttributes', async () => {
    const id = 'custom-id';
    const page = await newSpecPage({
      components: [Popover],
      template: () => <ion-popover htmlAttributes={{ id }} overlayIndex={-1}></ion-popover>,
    });

    const alert = page.body.querySelector('ion-popover')!;
    expect(alert.id).toBe(id);
  });
});
