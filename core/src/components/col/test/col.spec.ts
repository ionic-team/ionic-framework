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

  const cols = (n: number) => `calc(calc(${n} / var(--ion-grid-columns, 12)) * 100%)`;

  const COL_PARAMS = `offset="3" push="2" pull="1"`;

  it('should mirror push and pull when it declares rtl', async () => {
    const col = await newCol(`<ion-col dir="rtl" ${COL_PARAMS}></ion-col>`);
    expect(col.style.right).toBe(cols(2));
    expect(col.style.left).toBe(cols(1));
  });

  it('should mirror push and pull when an ancestor declares rtl', async () => {
    const col = await newCol(`<div dir="rtl"><div><ion-col ${COL_PARAMS}></ion-col></div></div>`);
    expect(col.style.right).toBe(cols(2));
    expect(col.style.left).toBe(cols(1));
  });

  it('should not mirror push and pull when an ancestor declares ltr in an rtl document', async () => {
    const col = await newCol(`<div dir="ltr"><div><ion-col ${COL_PARAMS}></ion-col></div></div>`, 'rtl');
    expect(col.style.right).toBe(cols(1));
    expect(col.style.left).toBe(cols(2));
  });
});
