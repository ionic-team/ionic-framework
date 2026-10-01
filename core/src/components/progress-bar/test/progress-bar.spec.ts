import { newSpecPage } from '@stencil/core/testing';

import { ProgressBar } from '../progress-bar';

describe('ion-progress-bar: rtl', () => {
  const newProgressBar = async (html: string) => {
    const page = await newSpecPage({ components: [ProgressBar], html });
    return page.body.querySelector('ion-progress-bar')!;
  };

  it('should reverse when an ancestor declares rtl', async () => {
    const progressBar = await newProgressBar(`<div dir="rtl"><div><ion-progress-bar></ion-progress-bar></div></div>`);
    expect(progressBar).toHaveClass('progress-bar-reversed');
  });

  it('should not reverse when an ancestor declares ltr', async () => {
    const progressBar = await newProgressBar(`<div dir="ltr"><ion-progress-bar></ion-progress-bar></div>`);
    expect(progressBar).not.toHaveClass('progress-bar-reversed');
  });

  // An rtl ancestor flips `reversed`, so the two cancel out.
  it('should not reverse when reversed is set inside an rtl ancestor', async () => {
    const progressBar = await newProgressBar(
      `<div dir="rtl"><ion-progress-bar reversed="true"></ion-progress-bar></div>`
    );
    expect(progressBar).not.toHaveClass('progress-bar-reversed');
  });

  it('should use the nearest ancestor that declares a dir', async () => {
    const progressBar = await newProgressBar(
      `<div dir="rtl"><div dir="ltr"><ion-progress-bar></ion-progress-bar></div></div>`
    );
    expect(progressBar).not.toHaveClass('progress-bar-reversed');
  });
});
