import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { PickerColumnCmp } from '../picker-column';

describe('picker-column: dynamic options', () => {
  /**
   * Issue: https://github.com/ionic-team/ionic-framework/issues/21763
   */
  it('should add an option', async () => {
    const defaultOptions = [
      { text: 'Dog', value: 'dog' },
      { text: 'Cat', value: 'cat' },
    ];

    const page = await newSpecPage({
      components: [PickerColumnCmp],
      template: () => <ion-picker-column col={{ options: defaultOptions, name: 'animals' }}></ion-picker-column>,
    });

    const pickerCol = page.body.querySelector('ion-picker-column')!;

    pickerCol.col = {
      options: [...defaultOptions, { text: 'Carrot', value: 'carrot' }],
      name: 'vegetables',
    };

    await page.waitForChanges();

    const pickerOpt = pickerCol.querySelector('.picker-opt:nth(2)')!;
    expect(pickerOpt.getAttribute('style')).toContain('transform');
  });
});
