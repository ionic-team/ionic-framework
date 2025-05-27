import { newSpecPage } from '@stencil/core/testing';

import { Picker } from '../picker';
import { h } from '@stencil/core';

describe('picker: id', () => {
  it('picker should be assigned an incrementing id', async () => {
    const page = await newSpecPage({
      components: [Picker],
      html: `<ion-picker-legacy is-open="true"></ion-picker-legacy>`,
    });
    let picker: HTMLIonPickerLegacyElement;

    picker = page.body.querySelector('ion-picker-legacy')!;

    expect(picker).not.toBe(null);
    expect(picker.getAttribute('id')).toBe('ion-overlay-1');

    // Remove the picker from the DOM
    picker.remove();
    await page.waitForChanges();

    // Create a new picker to verify the id is incremented
    picker = document.createElement('ion-picker-legacy');
    picker.isOpen = true;
    page.body.appendChild(picker);
    await page.waitForChanges();

    picker = page.body.querySelector('ion-picker-legacy')!;

    expect(picker.getAttribute('id')).toBe('ion-overlay-2');

    // Presenting the same picker again should reuse the existing id

    picker.isOpen = false;
    await page.waitForChanges();
    picker.isOpen = true;
    await page.waitForChanges();

    picker = page.body.querySelector('ion-picker-legacy')!;

    expect(picker.getAttribute('id')).toBe('ion-overlay-2');
  });

  it('should not overwrite the id set in htmlAttributes', async () => {
    const id = 'custom-id';
    const page = await newSpecPage({
      components: [Picker],
      template: () => <ion-picker-legacy htmlAttributes={{ id }} overlayIndex={-1}></ion-picker-legacy>,
    });

    const alert = page.body.querySelector('ion-picker-legacy')!;
    expect(alert.id).toBe(id);
  });
});
