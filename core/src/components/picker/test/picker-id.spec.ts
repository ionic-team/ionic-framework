import { newSpecPage } from '@stencil/core/testing';

import { Picker } from '../picker';

it('picker should be assigned an incrementing id', async () => {
  const page = await newSpecPage({
    components: [Picker],
    html: `<ion-picker is-open="true"></ion-picker>`,
  });
  let picker: HTMLIonPickerElement;

  picker = page.body.querySelector(
    'ion-picker'
  )!;

  expect(picker).not.toBe(null);
  expect(
    picker.getAttribute('id')
  ).toBe('ion-overlay-1');

  // Remove the picker from the DOM
  picker.remove();
  await page.waitForChanges();

  // Create a new picker to verify the id is incremented
  picker = document.createElement(
    'ion-picker'
  );
  picker.isOpen = true;
  page.body.appendChild(picker);
  await page.waitForChanges();

  picker = page.body.querySelector(
    'ion-picker'
  )!;

  expect(
    picker.getAttribute('id')
  ).toBe('ion-overlay-2');

  // Presenting the same picker again should reuse the existing id

  picker.isOpen = false;
  await page.waitForChanges();
  picker.isOpen = true;
  await page.waitForChanges();

  picker = page.body.querySelector(
    'ion-picker'
  )!;

  expect(
    picker.getAttribute('id')
  ).toBe('ion-overlay-2');
});
