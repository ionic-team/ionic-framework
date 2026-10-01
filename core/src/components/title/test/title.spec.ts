import { newSpecPage } from '@stencil/core/testing';

import { ToolbarTitle } from '../title';

describe('ion-title: rtl', () => {
  const newTitle = async (html: string) => {
    const page = await newSpecPage({ components: [ToolbarTitle], html });
    return page.body.querySelector('ion-title')!;
  };

  it('should set title-rtl when an ancestor declares rtl', async () => {
    const title = await newTitle(`<div dir="rtl"><div><ion-title>Title</ion-title></div></div>`);
    expect(title).toHaveClass('title-rtl');
  });

  it('should not set title-rtl when an ancestor declares ltr', async () => {
    const title = await newTitle(`<div dir="ltr"><ion-title>Title</ion-title></div>`);
    expect(title).not.toHaveClass('title-rtl');
  });

  it('should use the nearest ancestor that declares a dir', async () => {
    const title = await newTitle(`<div dir="rtl"><div dir="ltr"><ion-title>Title</ion-title></div></div>`);
    expect(title).not.toHaveClass('title-rtl');
  });
});
