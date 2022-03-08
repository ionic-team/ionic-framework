import type { E2EPage } from '@stencil/core/testing';
import { newE2EPage } from '@stencil/core/testing';

import { pullToRefresh } from '../test.utils';

describe('refresher: basic', () => {

  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage({
      url: '/src/components/refresher/test/basic?ionic:_testing=true'
    });
  });

  it('should match existing visual screenshots', async () => {
    const compare = await page.compareScreenshot();
    expect(compare).toMatchScreenshot();
  });

  it('should load more items when performing a pull-to-refresh', async () => {
    await pullToRefresh(page);

    const items = await page.findAll('ion-item');
    expect(items.length).toBe(60);
  });

});
