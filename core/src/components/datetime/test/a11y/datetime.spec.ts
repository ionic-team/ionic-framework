import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';

import { Item } from '../../../item/item';
import { Datetime } from '../../datetime';

describe('datetime', () => {
  beforeEach(() => {
    const mockIntersectionObserver =
      jest.fn();
    mockIntersectionObserver.mockReturnValue(
      {
        observe: () => null,
        unobserve: () => null,
        disconnect: () => null,
      }
    );
    global.IntersectionObserver =
      mockIntersectionObserver;
  });

  describe('month/year toggle', () => {
    let page: SpecPage;

    beforeEach(async () => {
      page = await newSpecPage({
        components: [Datetime, Item],
        html: `<ion-datetime></ion-datetime>`,
      });
    });

    it('should have aria-label "Show year picker" when collapsed', async () => {
      const datetime =
        page.body.querySelector(
          'ion-datetime'
        )!;
      const item =
        datetime.shadowRoot!.querySelector(
          '.calendar-month-year ion-item'
        );
      const monthYearToggleBtn =
        item!.shadowRoot!.querySelector(
          'button'
        );
      const ariaLabel =
        monthYearToggleBtn!.getAttribute(
          'aria-label'
        );

      expect(ariaLabel).toContain(
        'Show year picker'
      );
    });

    it('should have aria-label "Hide year picker" when expanded', async () => {
      const datetime =
        page.body.querySelector(
          'ion-datetime'
        )!;
      const item =
        datetime.shadowRoot!.querySelector<HTMLIonItemElement>(
          '.calendar-month-year ion-item'
        );

      item!.click();

      await page.waitForChanges();

      const itemAfter =
        datetime.shadowRoot!.querySelector<HTMLIonItemElement>(
          '.calendar-month-year ion-item'
        );
      const monthYearToggleBtn =
        itemAfter!.shadowRoot!.querySelector<HTMLElement>(
          'button'
        );
      const ariaLabel =
        monthYearToggleBtn!.getAttribute(
          'aria-label'
        );

      expect(ariaLabel).toContain(
        'Hide year picker'
      );
    });
  });
});
