import { newSpecPage } from '@stencil/core/testing';

import { PickerColumnOption } from '../picker-column-option';

describe('picker column option', () => {
  it('should be enabled by default', async () => {
    const page = await newSpecPage({
      components: [PickerColumnOption],
      html: `
        <ion-picker-column-option value="test">Test</ion-picker-column-otion>
      `,
    });

    const option = page.body.querySelector('ion-picker-column-option')!;

    await expect(option.classList.contains('option-disabled')).toEqual(false);
  });

  it('should be disabled if specified', async () => {
    const page = await newSpecPage({
      components: [PickerColumnOption],
      html: `
        <ion-picker-column-option disabled="true" value="test">Test</ion-picker-column-otion>
      `,
    });

    const option = page.body.querySelector('ion-picker-column-option')!;

    await expect(option.classList.contains('option-disabled')).toEqual(true);
  });
});
