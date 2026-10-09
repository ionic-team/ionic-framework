import { newSpecPage } from '@stencil/core/testing';

import { Label } from '../label';

describe('ion-label: rtl', () => {
  const newLabel = async (html: string, documentDir?: 'rtl') => {
    const page = await newSpecPage({ components: [Label], html: `<div></div>` });
    if (documentDir) {
      page.doc.documentElement.setAttribute('dir', documentDir);
    }
    await page.setContent(html);
    return page.body.querySelector('ion-label')!;
  };

  it('should set label-rtl when it declares rtl', async () => {
    const label = await newLabel(`<ion-label dir="rtl">Label</ion-label>`);
    expect(label).toHaveClass('label-rtl');
  });

  it('should set label-rtl when an ancestor declares rtl', async () => {
    const label = await newLabel(`<div dir="rtl"><div><ion-label>Label</ion-label></div></div>`);
    expect(label).toHaveClass('label-rtl');
  });
});
