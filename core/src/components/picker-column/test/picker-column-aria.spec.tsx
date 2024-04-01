import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { PickerColumnCmp } from '../picker-column';
/**
 * Stencil has an issue where having multiple spec tests in the same file,
 * will cause an exception to be thrown. This test is located in a separate file
 * to avoid this issue: https://github.com/ionic-team/stencil/issues/4053
 */
describe('picker-column', () => {
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
      name: 'programmingLanguages',
    };

    const page = await newSpecPage({
      components: [PickerColumnCmp],
      template: () => (
        <ion-picker-column
          col={col}
        ></ion-picker-column>
      ),
    });

    const firstOption =
      page.body.querySelector(
        'ion-picker-column .picker-opt:nth-child(1)'
      )!;
    const secondOption =
      page.body.querySelector(
        'ion-picker-column .picker-opt:nth-child(2)'
      )!;

    expect(
      firstOption.getAttribute(
        'aria-label'
      )
    ).toBe('C Sharp');
    expect(
      secondOption.getAttribute(
        'aria-label'
      )
    ).toBe(null);
  });
});
