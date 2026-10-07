import { newSpecPage } from '@stencil/core/testing';

import { Col } from '../col';

describe('ion-col: rtl', () => {
  const newCol = async (html: string, documentDir?: 'rtl') => {
    const page = await newSpecPage({ components: [Col], html: `<div></div>` });
    if (documentDir) {
      page.doc.documentElement.setAttribute('dir', documentDir);
    }
    await page.setContent(html);
    return page.body.querySelector('ion-col')!;
  };

  const CALC_STYLE = `calc(calc(3 / var(--ion-grid-columns, 12)) * 100%)`;
  const COL_PARAMS = `<ion-col offset="3" push="2" pull="1"></ion-col>`;

  it('should offset from the right when it declares rtl', async () => {
    expect((await newCol(`<ion-col dir="rtl" ${COL_PARAMS}></ion-col>`)).style.marginRight).toBe(CALC_STYLE);
  });

  it('should offset from the right when an ancestor declares rtl', async () => {
    expect((await newCol(`<div dir="rtl"><div><ion-col ${COL_PARAMS}></ion-col></div></div>`)).style.marginRight).toBe(CALC_STYLE);
  });

  it('should offset from the left when an ancestor declares ltr in an rtl document', async () => {
    expect((await newCol(`<div dir="ltr"><div><ion-col ${COL_PARAMS}></ion-col></div></div>`, 'rtl')).style.marginLeft).toBe(CALC_STYLE);
  });
});
