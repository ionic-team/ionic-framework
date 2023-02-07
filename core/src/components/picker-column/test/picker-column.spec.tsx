import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { PickerColumnCmp } from '../picker-column';

describe('picker-column', () => {
  it('should add class to host of component', async () => {
    const col = { cssClass: 'test-class', options: [] };

    const page = await newSpecPage({
      components: [PickerColumnCmp],
      template: () => <ion-picker-column col={col}></ion-picker-column>,
    });

    const pickerCol = page.body.querySelector('ion-picker-column');
    expect(pickerCol.classList.contains('test-class')).toBe(true);
  });

  it('should add aria-label to the picker column option', async () => {
    const col = {
      options: [
        {
          text: 'C#',
          ariaLabel: 'C Sharp',
        },
        {
          text: 'Java',
        },
      ],
    };

    const page = await newSpecPage({
      components: [PickerColumnCmp],
      template: () => <ion-picker-column col={col}></ion-picker-column>,
    });

    const firstOption = page.body.querySelector('ion-picker-column .picker-opt:nth-child(1)');
    const secondOption = page.body.querySelector('ion-picker-column .picker-opt:nth-child(2)');

    expect(firstOption.getAttribute('aria-label')).toBe('C Sharp');
    expect(secondOption.getAttribute('aria-label')).toBe(null);
  });
});
