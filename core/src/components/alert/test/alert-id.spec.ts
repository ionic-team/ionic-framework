import { newSpecPage } from '@stencil/core/testing';

import { Alert } from '../alert';

it('alert should be assigned an incrementing id', async () => {
  const page = await newSpecPage({
    components: [Alert],
    html: `<ion-alert is-open="true"></ion-alert>`,
  });
  let alert: HTMLIonAlertElement;

  alert = page.body.querySelector(
    'ion-alert'
  )!;

  expect(alert).not.toBe(null);
  expect(alert.getAttribute('id')).toBe(
    'ion-overlay-1'
  );

  // Remove the alert from the DOM
  alert.remove();
  await page.waitForChanges();

  // Create a new alert to verify the id is incremented
  alert = document.createElement(
    'ion-alert'
  );
  alert.isOpen = true;
  page.body.appendChild(alert);
  await page.waitForChanges();

  alert = page.body.querySelector(
    'ion-alert'
  )!;

  expect(alert.getAttribute('id')).toBe(
    'ion-overlay-2'
  );

  // Presenting the same alert again should reuse the existing id

  alert.isOpen = false;
  await page.waitForChanges();
  alert.isOpen = true;
  await page.waitForChanges();

  alert = page.body.querySelector(
    'ion-alert'
  )!;

  expect(alert.getAttribute('id')).toBe(
    'ion-overlay-2'
  );
});
