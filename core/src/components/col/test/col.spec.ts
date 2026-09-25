import { newSpecPage } from '@stencil/core/testing';

import { Col } from '../col';

describe('ion-col: rtl', () => {
  const newCol = async (html: string) => {
    const page = await newSpecPage({ components: [Col], html });
    return page.body.querySelector('ion-col')!;
  };

  it('should offset, push and pull from the start when no dir is declared', async () => {
    const col = await newCol(`<ion-col offset="3" push="2" pull="1"></ion-col>`);
    expect(col.style.marginLeft).not.toBe('');
    expect(col.style.marginRight).toBe('');
    expect(col.style.left).not.toBe('');
    expect(col.style.right).not.toBe('');
  });

  it('should mirror offset, push and pull when an ancestor declares rtl', async () => {
    const col = await newCol(`<div dir="rtl"><div><ion-col offset="3" push="2" pull="1"></ion-col></div></div>`);
    expect(col.style.marginRight).not.toBe('');
    expect(col.style.marginLeft).toBe('');
  });

  it('should not mirror when an ancestor declares ltr', async () => {
    const col = await newCol(`<div dir="ltr"><ion-col offset="3"></ion-col></div>`);
    expect(col.style.marginLeft).not.toBe('');
    expect(col.style.marginRight).toBe('');
  });

  it('should use the nearest ancestor that declares a dir', async () => {
    const col = await newCol(`<div dir="rtl"><div dir="ltr"><ion-col offset="3"></ion-col></div></div>`);
    expect(col.style.marginLeft).not.toBe('');
    expect(col.style.marginRight).toBe('');
  });
});
