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
    it('should have aria-label "Show year picker" when collapsed', async () => {
      const page = await newSpecPage({
        components: [Datetime],
        html: `<ion-datetime></ion-datetime>`,
      });

      const datetime = page.body.querySelector('ion-datetime')!;
      const monthYearToggleBtn = datetime.shadowRoot!.querySelector('.calendar-month-year-toggle')!;
      const ariaLabel = monthYearToggleBtn.getAttribute('aria-label');

      expect(ariaLabel).toContain('Show year picker');
    });

    it('should have aria-label "Hide year picker" when expanded', async () => {
      const page = await newSpecPage({
        components: [Datetime],
        html: `<ion-datetime></ion-datetime>`,
      });

      const datetime = page.body.querySelector('ion-datetime')!;
      const monthYearToggleBtn = datetime.shadowRoot!.querySelector('.calendar-month-year-toggle')!;

      monthYearToggleBtn.click();
      await page.waitForChanges();

      const ariaLabel = monthYearToggleBtn.getAttribute('aria-label');

      expect(ariaLabel).toContain('Hide year picker');
    });
  });
});
