import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { Datetime } from '../../../datetime/datetime';

describe('ion-datetime disabled', () => {
  beforeEach(() => {
    // IntersectionObserver isn't available in test environment
    global.IntersectionObserver = class IntersectionObserver {
      constructor() {}

      disconnect() {
        return null;
      }

      observe() {
        return null;
      }

      takeRecords() {
        return null;
      }

      unobserve() {
        return null;
      }
    };
  });

  it('picker should be disabled in prefer wheel mode', async () => {
    const page = await newSpecPage({
      components: [Datetime],
      template: () => (
        <ion-datetime id="inline-datetime-wheel" disabled prefer-wheel value="2022-04-21T00:00:00"></ion-datetime>
      ),
    });

    await page.waitForChanges();

    const datetime = page.body.querySelector('ion-datetime')!;
    const columns = datetime.shadowRoot!.querySelectorAll('ion-picker-column-internal');

    await expect(columns.length).toEqual(4);

    columns.forEach((column) => {
      expect(column.getAttribute('disabled')).not.toBeNull();
    });
  });
});
