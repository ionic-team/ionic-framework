import { newSpecPage } from '@stencil/core/testing';

import { ToolbarTitle } from '../title';

describe('ion-title: rtl', () => {
  const newTitle = async (html: string, documentDir?: 'rtl') => {
    const page = await newSpecPage({ components: [ToolbarTitle], html: `<div></div>` });
    if (documentDir) {
      page.doc.documentElement.setAttribute('dir', documentDir);
    }
    await page.setContent(html);
    return page.body.querySelector('ion-title')!;
  };

  it('should set title-rtl when it declares rtl', async () => {
    const title = await newTitle(`<ion-title dir="rtl">Title</ion-title>`);
    expect(title).toHaveClass('title-rtl');
  });

  it('should set title-rtl when an ancestor declares rtl', async () => {
    const title = await newTitle(`<div dir="rtl"><div><ion-title>Title</ion-title></div></div>`);
    expect(title).toHaveClass('title-rtl');
  });

  it('should set title-ltr when an ancestor declares ltr in an rtl document', async () => {
    const title = await newTitle(`<div dir="ltr"><div><ion-title>Title</ion-title></div></div>`, 'rtl');
    expect(title).toHaveClass('title-ltr');
  });
});
