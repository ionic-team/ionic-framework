import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { Popover } from '../../popover';

describe('popover: htmlAttributes inheritance', () => {
  it('should correctly inherit attributes on host', async () => {
    const page = await newSpecPage({
      components: [Popover],
      template: () => <ion-popover overlayIndex={1} htmlAttributes={{ 'data-testid': 'basic-popover' }}></ion-popover>,
    });

    const popover = page.body.querySelector('ion-popover')!;

    await expect(popover.getAttribute('data-testid')).toBe('basic-popover');
  });
});
