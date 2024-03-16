import { newSpecPage } from '@stencil/core/testing';

import { Item } from '../../../item/item';
import { Input } from '../../input';

it('should render as modern when label is set asynchronously', async () => {
  const page = await newSpecPage({
    components: [Item, Input],
    html: `
      <ion-item>
        <ion-input></ion-input>
      </ion-item>
    `,
  });

  const input = page.body.querySelector('ion-input')!;

  // Template should be modern
  expect(input.classList.contains('legacy-input')).toBe(false);

  // Update the input label
  input.label = 'New label';
  await page.waitForChanges();

  // Template should still be modern
  expect(input.classList.contains('legacy-input')).toBe(false);
});
