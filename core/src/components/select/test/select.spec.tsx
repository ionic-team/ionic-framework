import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { Select } from '../select';

describe('ion-select', () => {
  it('should render hidden input for form validation', async () => {
    const page = await newSpecPage({
      components: [Select],
      template: () => <ion-select value="my value" name="my name" disabled={true}></ion-select>,
    });

    const select = page.body.querySelector('ion-select');

    const hiddenInput = select.querySelector('input[type="hidden"]');
    expect(hiddenInput).not.toBe(null);

    expect(hiddenInput.value).toBe('my value');
    expect(hiddenInput.disabled).toBe(true);
    expect(hiddenInput.name).toBe('my name');
  });
});
