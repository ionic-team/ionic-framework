import { newSpecPage } from '@stencil/core/testing';

import { Checkbox } from '../checkbox';

describe('ion-checkbox: shadow parts', () => {
  it('should render the checkbox with shadow parts', async () => {
    const page = await newSpecPage({
      components: [Checkbox],
      html: `
        <ion-checkbox>Checkbox</ion-checkbox>
      `,
    });

    const checkbox = page.body.querySelector('ion-checkbox')!;

    expect(checkbox).toHaveShadowPart('container');
    expect(checkbox).toHaveShadowPart('label');
    expect(checkbox).toHaveShadowPart('mark');
  });
});

describe('ion-checkbox: disabled', () => {
  it('clicking disabled checkbox should not toggle checked state', async () => {
    const page = await newSpecPage({
      components: [Checkbox],
      html: `
        <ion-checkbox disabled="true">Checkbox</ion-checkbox>
      `,
    });

    const checkbox = page.body.querySelector('ion-checkbox')!;

    expect(checkbox.checked).toBe(false);

    checkbox.click();

    await page.waitForChanges();

    expect(checkbox.checked).toBe(false);
  });
});

describe('ion-checkbox: indeterminate', () => {
  it('should have a mixed value for aria-checked', async () => {
    const page = await newSpecPage({
      components: [Checkbox],
      html: `
        <ion-checkbox indeterminate="true">Checkbox</ion-checkbox>
      `,
    });

    const checkbox = page.body.querySelector('ion-checkbox')!;

    expect(checkbox.getAttribute('aria-checked')).toBe('mixed');
  });
});
