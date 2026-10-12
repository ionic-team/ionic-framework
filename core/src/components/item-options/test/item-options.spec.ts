import { newSpecPage } from '@stencil/core/testing';

import { ItemOptions } from '../item-options';

describe('ion-item-options: rtl', () => {
  const newItemOptions = async (html: string, documentDir?: 'rtl') => {
    const page = await newSpecPage({ components: [ItemOptions], html: `<div></div>` });
    if (documentDir) {
      page.doc.documentElement.setAttribute('dir', documentDir);
    }
    await page.setContent(html);
    return page.body.querySelector('ion-item-options')!;
  };

  it('should change sides when an ancestor declares rtl', async () => {
    const itemOptions = await newItemOptions(
      `<div dir="rtl"><div><ion-item-options side="start"></ion-item-options></div></div>`
    );
    expect(itemOptions).toHaveClass('item-options-end');
    expect(itemOptions).not.toHaveClass('item-options-start');
  });

  it('should not change sides when an ancestor declares ltr in an rtl document', async () => {
    const itemOptions = await newItemOptions(
      `<div dir="ltr"><div><ion-item-options side="start"></ion-item-options></div></div>`,
      'rtl'
    );
    expect(itemOptions).toHaveClass('item-options-start');
    expect(itemOptions).not.toHaveClass('item-options-end');
  });

  it('should change sides from the document when no ancestor declares a dir', async () => {
    const itemOptions = await newItemOptions(`<div><ion-item-options side="start"></ion-item-options></div>`, 'rtl');
    expect(itemOptions).toHaveClass('item-options-end');
    expect(itemOptions).not.toHaveClass('item-options-start');
  });
});
