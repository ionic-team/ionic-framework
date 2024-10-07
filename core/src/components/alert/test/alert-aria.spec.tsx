import { newSpecPage } from '@stencil/core/testing';

import { Alert } from '../alert';

describe('alert: aria', () => {
  it('alert should assign proper aria attributes and tag names with a header, subHeader and message', async () => {
    const page = await newSpecPage({
      components: [Alert],
      html: `<ion-alert is-open="true" header="Alert" sub-header="Subtitle" message="This is an alert message."></ion-alert>`,
    });

    const alert = page.body.querySelector('ion-alert')!;

    expect(alert.getAttribute('id')).toBe('ion-overlay-1');
    expect(alert.getAttribute('aria-labelledby')).toBe('alert-1-hdr alert-1-sub-hdr');
    expect(alert.getAttribute('aria-describedby')).toBe('alert-1-msg');

    const header = page.body.querySelector('.alert-title')!;
    expect(header.tagName).toBe('H2');

    const subHeader = page.body.querySelector('.alert-sub-title')!;
    expect(subHeader.tagName).toBe('H3');
  });

  it('alert should assign proper aria attributes and tag name with only a header', async () => {
    const page = await newSpecPage({
      components: [Alert],
      html: `<ion-alert is-open="true" header="Alert"></ion-alert>`,
    });

    const alert = page.body.querySelector('ion-alert')!;

    expect(alert.getAttribute('id')).toBe('ion-overlay-2');
    expect(alert.getAttribute('aria-labelledby')).toBe('alert-2-hdr');

    const header = page.body.querySelector('.alert-title')!;
    expect(header.tagName).toBe('H2');
  });

  it('alert should assign proper aria attributes and tag name with only a subHeader', async () => {
    const page = await newSpecPage({
      components: [Alert],
      html: `<ion-alert is-open="true" sub-header="Subtitle"></ion-alert>`,
    });

    const alert = page.body.querySelector('ion-alert')!;

    expect(alert.getAttribute('id')).toBe('ion-overlay-3');
    expect(alert.getAttribute('aria-labelledby')).toBe('alert-3-sub-hdr');

    const subHeader = page.body.querySelector('.alert-sub-title')!;
    expect(subHeader.tagName).toBe('H2');
  });
});
