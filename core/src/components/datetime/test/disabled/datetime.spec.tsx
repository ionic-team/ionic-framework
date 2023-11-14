import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { Datetime } from '../../datetime/datetime';

describe('ion-datetime disabled', () => {
  it('picker should be disabled in prefer wheel mode', async () => {
    const page = await newSpecPage({
      components: [Datetime],
      template: () => (
        <ion-datetime id="inline-datetime-wheel" disabled prefer-wheel value="2022-04-21T00:00:00"></ion-datetime>
      ),
    });

    await page.waitForSelector('.datetime-ready');

    for (const column of await page.locator('ion-picker-column-internal').all()) {
      await expect(column).toHaveAttribute('disabled');
    }
  });
});
