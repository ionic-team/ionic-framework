import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { PickerColumnCmp } from '../picker-column';
/**
 * Stencil has an issue where having multiple spec tests in the same file,
 * will cause an exception to be thrown. This test is located in a separate file
 * to avoid this issue.
 *
 * Example exception:
 * ```
 * TypeError: Cannot read properties of undefined (reading '$instanceValues$')
    at getValue (/Users/sean/Documents/ionic/framework-next/core/node_modules/@stencil/core/internal/testing/index.js:542:282)
    at PickerColumnCmp.get (/Users/sean/Documents/ionic/framework-next/core/node_modules/@stencil/core/internal/testing/index.js:571:13)
    at PickerColumnCmp.refresh (/Users/sean/Documents/ionic/framework-next/core/src/components/picker-column/picker-column.tsx:304:20)
    at Timeout._onTimeout (/Users/sean/Documents/ionic/framework-next/core/src/components/picker-column/picker-column.tsx:73:12)
    at listOnTimeout (node:internal/timers:559:17)
    at processTimers (node:internal/timers:502:7)

 * ```
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
