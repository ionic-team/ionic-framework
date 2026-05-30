import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { Item } from '../item';

describe('item', () => {
  it('should change focusable option after switching button option status', async () => {
    const page = await newSpecPage({
      components: [Item],
      template: () => <ion-item button={false}></ion-item>,
    });

    const item = page.body.querySelector('ion-item')!;
    // Change button attribute to true
    item.setAttribute('button', 'true');

    await page.waitForChanges();

    // Check if it has the expected class that gives the focused styles to the item element
    expect(item).toHaveClass('ion-focusable');
  });
});
