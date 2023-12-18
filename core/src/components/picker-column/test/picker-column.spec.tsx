import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { PickerColumnCmp } from '../picker-column';

describe('picker-column', () => {
  it('should add class to host of component', async () => {
    const col = { cssClass: 'test-class', options: [], name: 'col' };

    const page = await newSpecPage({
      components: [PickerColumnCmp],
      template: () => <ion-picker-column col={col}></ion-picker-column>,
    });

    const pickerCol = page.body.querySelector('ion-picker-column')!;
    expect(pickerCol.classList.contains('test-class')).toBe(true);
  });
});
