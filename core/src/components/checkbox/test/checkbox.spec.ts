import { newSpecPage } from '@stencil/core/testing';

import { Checkbox } from '../checkbox';

describe('ion-checkbox: disabled', () => {
  it('clicking disabled checkbox should not toggle checked state', async () => {
    const page = await newSpecPage({
      components: [Checkbox],
      html: `
        <ion-checkbox disabled="true">Checkbox</ion-checkbox>
      `,
    });

    const checkbox = page.body.querySelector('ion-checkbox');

    expect(checkbox.checked).toBe(false);

    checkbox.click();

    await page.waitForChanges();

    expect(checkbox.checked).toBe(false);
  });
});
