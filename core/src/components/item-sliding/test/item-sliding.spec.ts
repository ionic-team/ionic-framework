import { newSpecPage } from '@stencil/core/testing';

import { ItemOptions } from '../../item-options/item-options';
import { ItemSliding } from '../item-sliding';

describe('ion-item-sliding: rtl', () => {
  const newItemSliding = async (optionsAttrs: string) => {
    const page = await newSpecPage({
      components: [ItemSliding, ItemOptions],
      html: `<ion-item-sliding>
               <ion-item>Item</ion-item>
               <ion-item-options ${optionsAttrs}></ion-item-options>
             </ion-item-sliding>`,
    });

    await page.waitForChanges();

    return page;
  };

  /**
   * Opening only moves the item when the requested side matches the side the
   * options were filed under, so it is what reveals the direction that was
   * resolved for them.
   */
  const opensFrom = async (optionsAttrs: string, side: 'start' | 'end') => {
    const page = await newItemSliding(optionsAttrs);
    const itemSliding = page.body.querySelector('ion-item-sliding')!;

    await itemSliding.open(side);
    await page.waitForChanges();

    return itemSliding.classList.contains('item-sliding-active-slide');
  };

  it('should file a start-side option under the start when no dir is declared', async () => {
    expect(await opensFrom(`side="start"`, 'start')).toBe(true);
    expect(await opensFrom(`side="start"`, 'end')).toBe(false);
  });

  it('should file a start-side option under the end when the options element declares rtl', async () => {
    expect(await opensFrom(`side="start" dir="rtl"`, 'end')).toBe(true);
    expect(await opensFrom(`side="start" dir="rtl"`, 'start')).toBe(false);
  });

  it('should file a start-side option under the end when an ancestor declares rtl', async () => {
    const page = await newSpecPage({
      components: [ItemSliding, ItemOptions],
      html: `<div dir="rtl">
               <ion-item-sliding>
                 <ion-item>Item</ion-item>
                 <ion-item-options side="start"></ion-item-options>
               </ion-item-sliding>
             </div>`,
    });
    await page.waitForChanges();

    const itemSliding = page.body.querySelector('ion-item-sliding')!;
    await itemSliding.open('end');
    await page.waitForChanges();

    expect(itemSliding).toHaveClass('item-sliding-active-slide');
  });

  /**
   * ion-item-options resolves its own side, so a dir declared on it has to
   * resolve the same way here or the options would render on one side while
   * opening from the other.
   */
  it('should resolve the same side that the options element renders', async () => {
    const page = await newItemSliding(`side="start" dir="rtl"`);
    const itemSliding = page.body.querySelector('ion-item-sliding')!;
    const itemOptions = page.body.querySelector('ion-item-options')!;

    expect(itemOptions).toHaveClass('item-options-end');

    await itemSliding.open('end');
    await page.waitForChanges();

    expect(itemSliding).toHaveClass('item-sliding-active-slide');
  });
});
