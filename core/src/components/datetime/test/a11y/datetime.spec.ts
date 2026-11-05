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
        html: `<ion-datetime locale="en-US" value="2022-02-22"></ion-datetime>`,
      });
    });

    it('should include the visible month/year and show action when collapsed', async () => {
      const datetime = page.body.querySelector('ion-datetime')!;
      const monthYearToggleBtn = datetime.shadowRoot!.querySelector('.calendar-month-year .calendar-month-year-toggle');
      const ariaLabel = monthYearToggleBtn!.getAttribute('aria-label');

      expect(ariaLabel).toBe('February 2022, Show year picker');
    });

    it('should include the visible month/year and hide action when expanded', async () => {
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

      expect(ariaLabel).toBe('February 2022, Hide year picker');
    });

    it('should include the localized month/year when the locale changes', async () => {
      const datetime = page.body.querySelector('ion-datetime')!;
      datetime.locale = 'de-DE';

      await page.waitForChanges();

      const monthYearToggleBtn = datetime.shadowRoot!.querySelector('.calendar-month-year .calendar-month-year-toggle');

      expect(monthYearToggleBtn!.getAttribute('aria-label')).toBe('Februar 2022, Show year picker');
    });
  });
});
