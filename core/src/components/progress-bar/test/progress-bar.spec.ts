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

  it('should reverse when an ancestor declares rtl', async () => {
    const progressBar = await newProgressBar(`<div dir="rtl"><div><ion-progress-bar></ion-progress-bar></div></div>`);
    expect(progressBar).toHaveClass('progress-bar-reversed');
  });

  // An rtl ancestor flips `reversed`, so the two cancel out.
  it('should not reverse when reversed is set inside an rtl ancestor', async () => {
    const progressBar = await newProgressBar(
      `<div dir="rtl"><ion-progress-bar reversed="true"></ion-progress-bar></div>`
    );
    expect(progressBar).not.toHaveClass('progress-bar-reversed');
  });

  it('should not reverse when an ancestor declares ltr in an rtl document', async () => {
    const progressBar = await newProgressBar(
      `<div dir="ltr"><div><ion-progress-bar></ion-progress-bar></div></div>`,
      'rtl'
    );
    expect(progressBar).not.toHaveClass('progress-bar-reversed');
  });
});
