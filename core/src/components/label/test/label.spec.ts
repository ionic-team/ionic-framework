import { newSpecPage } from '@stencil/core/testing';

import { Label } from '../label';

describe('ion-label: rtl', () => {
  const newLabel = async (html: string) => {
    const page = await newSpecPage({ components: [Label], html });
    return page.body.querySelector('ion-label')!;
  };

  it('should set label-rtl when an ancestor declares rtl', async () => {
    const label = await newLabel(`<div dir="rtl"><div><ion-label>Label</ion-label></div></div>`);
    expect(label).toHaveClass('label-rtl');
  });

  it('should not set label-rtl when an ancestor declares ltr', async () => {
    const label = await newLabel(`<div dir="ltr"><ion-label>Label</ion-label></div>`);
    expect(label).not.toHaveClass('label-rtl');
  });

  it('should use the nearest ancestor that declares a dir', async () => {
    const label = await newLabel(`<div dir="rtl"><div dir="ltr"><ion-label>Label</ion-label></div></div>`);
    expect(label).not.toHaveClass('label-rtl');
  });
});
