import { newSpecPage } from '@stencil/core/testing';

import { PickerColumnOption } from '../picker-column-option';

describe('PickerColumnOption', () => {
  it('option should be enabled by default', async () => {
    const page = await newSpecPage({
      components: [PickerColumnOption],
      html: `
        <ion-picker-column-option value="a">A</ion-picker-column-option>
      `,
    });

    const pickerColumnOption = page.body.querySelector('ion-picker-column-option')!;
    const button = pickerColumnOption.shadowRoot!.querySelector('button')!;
    expect(button.hasAttribute('disabled')).toEqual(false);
  });
  it('disabled option should have disabled button', async () => {
    const page = await newSpecPage({
      components: [PickerColumnOption],
      html: `
        <ion-picker-column-option value="a" disabled="true">A</ion-picker-column-option>
      `,
    });

    const pickerColumnOption = page.body.querySelector('ion-picker-column-option')!;
    const button = pickerColumnOption.shadowRoot!.querySelector('button')!;

    expect(button.hasAttribute('disabled')).toEqual(true);
  });
});
