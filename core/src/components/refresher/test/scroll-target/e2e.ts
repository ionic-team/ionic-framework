import type { E2EPage } from '@stencil/core/testing';
import { newE2EPage } from '@stencil/core/testing';

import { pullToRefresh } from '../test.utils';

describe('refresher: custom scroll target', () => {

  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage({
      url: '/src/components/refresher/test/scroll-target?ionic:_testing=true'
    });
  });

  it('should load more items when performing a pull-to-refresh', async () => {
    await pullToRefresh(page);

    const items = await page.findAll('ion-item');
    expect(items.length).toBe(60);
  });

});
