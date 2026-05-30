import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';

import { Datetime } from '../../datetime';

describe('datetime', () => {
  beforeEach(() => {
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    global.IntersectionObserver = mockIntersectionObserver;
  });

  describe('month/year toggle', () => {
    let page: SpecPage;

    beforeEach(async () => {
      page = await newSpecPage({
        components: [Datetime],
        html: `<ion-datetime></ion-datetime>`,
      });
    });

    it('should have aria-label "Show year picker" when collapsed', async () => {
      const datetime = page.body.querySelector('ion-datetime')!;
      const monthYearToggleBtn = datetime.shadowRoot!.querySelector('.calendar-month-year .calendar-month-year-toggle');
      const ariaLabel = monthYearToggleBtn!.getAttribute('aria-label');

      expect(ariaLabel).toContain('Show year picker');
    });

    it('should have aria-label "Hide year picker" when expanded', async () => {
      const datetime = page.body.querySelector('ion-datetime')!;
      const monthYearToggleBtn = datetime.shadowRoot!.querySelector<HTMLButtonElement>(
        '.calendar-month-year .calendar-month-year-toggle'
      );

      monthYearToggleBtn!.click();

      await page.waitForChanges();

      const monthYearToggleBtnAfter = datetime.shadowRoot!.querySelector<HTMLButtonElement>(
        '.calendar-month-year .calendar-month-year-toggle'
      );
      const ariaLabel = monthYearToggleBtnAfter!.getAttribute('aria-label');

      expect(ariaLabel).toContain('Hide year picker');
    });
  });
});
