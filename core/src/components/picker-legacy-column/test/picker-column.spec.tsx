import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { PickerColumnCmp } from '../picker-column';

describe('picker-column', () => {
  it('should add class to host of component', async () => {
    const col = { cssClass: 'test-class', options: [], name: 'col' };

    const page = await newSpecPage({
      components: [PickerColumnCmp],
      template: () => <ion-picker-legacy-column col={col}></ion-picker-legacy-column>,
    });

    const pickerCol = page.body.querySelector('ion-picker-legacy-column')!;
    expect(pickerCol.classList.contains('test-class')).toBe(true);
  });
});
