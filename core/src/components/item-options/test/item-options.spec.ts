import { newSpecPage } from '@stencil/core/testing';

import { ItemOptions } from '../item-options';

describe('ion-item-options: rtl', () => {
  const newItemOptions = async (html: string) => {
    const page = await newSpecPage({ components: [ItemOptions], html });
    return page.body.querySelector('ion-item-options')!;
  };

  it('should change sides when an ancestor declares rtl', async () => {
    const itemOptions = await newItemOptions(
      `<div dir="rtl"><div><ion-item-options side="start"></ion-item-options></div></div>`
    );
    expect(itemOptions).toHaveClass('item-options-end');
    expect(itemOptions).not.toHaveClass('item-options-start');
  });

  it('should not change sides when an ancestor declares ltr', async () => {
    const itemOptions = await newItemOptions(
      `<div dir="ltr"><div><ion-item-options side="start"></ion-item-options></div></div>`
    );
    expect(itemOptions).toHaveClass('item-options-start');
    expect(itemOptions).not.toHaveClass('item-options-end');
  });

  it('should use the nearest ancestor that declares a dir', async () => {
    const itemOptions = await newItemOptions(
      `<div dir="rtl"><div dir="ltr"><ion-item-options side="start"></ion-item-options></div></div>`
    );
    expect(itemOptions).toHaveClass('item-options-start');
  });
});
