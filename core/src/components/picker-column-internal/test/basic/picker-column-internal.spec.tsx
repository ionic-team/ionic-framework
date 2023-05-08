import { h } from '@stencil/core';

import { newSpecPage } from '@stencil/core/testing';

import { PickerColumnInternal } from '../../picker-column-internal';

describe('ion-picker-column-internal', () => {
  it('should render a picker item for each item', async () => {
    const page = await newSpecPage({
      components: [PickerColumnInternal],
      template: () => <ion-picker-column-internal></ion-picker-column-internal>
    });
   // const pickerColumn = page.body.querySelector('ion-picker-column-internal');
    //const columns = Array.from(pickerColumn.shadowRoot.querySelectorAll('.picker-item'));

    // https://github.com/ionic-team/stencil/issues/3588
    //const activeColumns = columns.filter(column => !column.classList.contains('.picker-item-empty'))
    //await expect(activeColumns.length).toBe(3);
  });
});
