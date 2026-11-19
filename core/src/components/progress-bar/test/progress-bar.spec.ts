import { newSpecPage } from '@stencil/core/testing';

import { ProgressBar } from '../progress-bar';

describe('ion-progress-bar: rtl', () => {
  const newProgressBar = async (html: string, documentDir?: 'rtl') => {
    const page = await newSpecPage({ components: [ProgressBar], html: `<div></div>` });
    if (documentDir) {
      page.doc.documentElement.setAttribute('dir', documentDir);
    }
    await page.setContent(html);
    return page.body.querySelector('ion-progress-bar')!;
  };

  it('should reverse when it declares rtl', async () => {
    const progressBar = await newProgressBar(`<ion-progress-bar dir="rtl"></ion-progress-bar>`);
    expect(progressBar).toHaveClass('progress-bar-reversed');
  });

  it('should reverse when an ancestor declares rtl', async () => {
    const progressBar = await newProgressBar(`<div dir="rtl"><div><ion-progress-bar></ion-progress-bar></div></div>`);
    expect(progressBar).toHaveClass('progress-bar-reversed');
  });

  it('should not reverse when an ancestor declares ltr in an rtl document', async () => {
    const progressBar = await newProgressBar(
      `<div dir="ltr"><div><ion-progress-bar></ion-progress-bar></div></div>`,
      'rtl'
    );
    expect(progressBar).not.toHaveClass('progress-bar-reversed');
  });
});
