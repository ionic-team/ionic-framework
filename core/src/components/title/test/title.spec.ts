import { newSpecPage } from '@stencil/core/testing';

import { ToolbarTitle } from '../title';

describe('ion-title: rtl', () => {
  /**
   * `newSpecPage` installs a fresh document, so the document direction has to
   * be set on that document before the content is rendered.
   */
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
});
