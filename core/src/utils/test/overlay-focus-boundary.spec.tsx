import { newSpecPage } from '@stencil/core/testing';

import { Alert } from '../../components/alert/alert';
import { Modal } from '../../components/modal/modal';

/**
 * Focuses a boundary the way a browser does when Tab lands on it:
 * `relatedTarget` is the element focus is coming from.
 */
const focusBoundary = (boundary: Element, relatedTarget: EventTarget | null) => {
  boundary.dispatchEvent(new FocusEvent('focus', { relatedTarget }));
};

describe('overlay focus boundary', () => {
  describe('shadow overlay', () => {
    const setup = async () => {
      const page = await newSpecPage({
        components: [Modal],
        html: `
          <button id="outside">Outside</button>
          <ion-modal>
            <button id="first">First</button>
            <button id="last">Last</button>
          </ion-modal>
        `,
      });
      const modal = page.body.querySelector('ion-modal')!;
      const [start, end] = Array.from(modal.shadowRoot!.querySelectorAll('.ion-overlay-focus-boundary'));
      const outside = page.body.querySelector<HTMLElement>('#outside')!;
      const first = page.body.querySelector<HTMLElement>('#first')!;
      const last = page.body.querySelector<HTMLElement>('#last')!;
      const focusFirst = jest.spyOn(first, 'focus');
      const focusLast = jest.spyOn(last, 'focus');

      return { modal, start, end, outside, first, last, focusFirst, focusLast };
    };

    it('should render a boundary before and after the content, hidden from assistive technology', async () => {
      const { modal, start, end } = await setup();
      const wrapper = modal.shadowRoot!.querySelector('.ion-overlay-wrapper');

      expect(start.nextElementSibling).toBe(wrapper);
      expect(wrapper!.nextElementSibling).toBe(end);

      for (const boundary of [start, end]) {
        expect(boundary.getAttribute('tabindex')).toBe('0');
        expect(boundary.getAttribute('aria-hidden')).toBe('true');
      }
    });

    it('should wrap to the last element when Shift+Tab leaves the first element', async () => {
      const { start, first, focusFirst, focusLast } = await setup();

      focusBoundary(start, first);

      expect(focusLast).toHaveBeenCalled();
      expect(focusFirst).not.toHaveBeenCalled();
    });

    it('should wrap to the first element when Tab leaves the last element', async () => {
      const { end, last, focusFirst, focusLast } = await setup();

      focusBoundary(end, last);

      expect(focusFirst).toHaveBeenCalled();
      expect(focusLast).not.toHaveBeenCalled();
    });

    it('should treat focus from inside the shadow root as coming from inside', async () => {
      const { modal, start, focusFirst, focusLast } = await setup();
      const wrapper = modal.shadowRoot!.querySelector('.ion-overlay-wrapper')!;

      focusBoundary(start, wrapper);

      expect(focusLast).toHaveBeenCalled();
      expect(focusFirst).not.toHaveBeenCalled();
    });

    it('should enter at the first element when Tab arrives from outside', async () => {
      const { start, outside, focusFirst, focusLast } = await setup();

      focusBoundary(start, outside);

      expect(focusFirst).toHaveBeenCalled();
      expect(focusLast).not.toHaveBeenCalled();
    });

    it('should enter at the last element when Shift+Tab arrives from outside', async () => {
      const { end, outside, focusFirst, focusLast } = await setup();

      focusBoundary(end, outside);

      expect(focusLast).toHaveBeenCalled();
      expect(focusFirst).not.toHaveBeenCalled();
    });

    it('should enter at the first element when Tab leaves the focused overlay host', async () => {
      const { modal, start, focusFirst, focusLast } = await setup();

      focusBoundary(start, modal);

      expect(focusFirst).toHaveBeenCalled();
      expect(focusLast).not.toHaveBeenCalled();
    });

    it('should enter at the nearest end when focus arrives from outside the page', async () => {
      const { start, end, focusFirst, focusLast } = await setup();

      focusBoundary(start, null);
      expect(focusFirst).toHaveBeenCalledTimes(1);

      focusBoundary(end, null);
      expect(focusLast).toHaveBeenCalledTimes(1);
    });
  });

  describe('scoped overlay', () => {
    const setup = async (buttons: string[]) => {
      const page = await newSpecPage({
        components: [Alert],
        html: `<button id="outside">Outside</button><ion-alert></ion-alert>`,
      });
      const alert = page.body.querySelector('ion-alert')!;
      alert.buttons = buttons;
      await page.waitForChanges();

      const [start, end] = Array.from(alert.querySelectorAll('.ion-overlay-focus-boundary'));
      const alertButtons = Array.from(alert.querySelectorAll<HTMLElement>('.alert-button'));

      return { page, alert, start, end, alertButtons };
    };

    it('should search the wrapper so a boundary never focuses another boundary', async () => {
      const { page, start, end, alertButtons } = await setup(['First', 'Last']);
      const [first, last] = alertButtons;
      const outside = page.body.querySelector<HTMLElement>('#outside')!;
      const focusFirst = jest.spyOn(first, 'focus');
      const focusLast = jest.spyOn(last, 'focus');
      const focusStart = jest.spyOn(start as HTMLElement, 'focus');
      const focusEnd = jest.spyOn(end as HTMLElement, 'focus');

      focusBoundary(start, outside);
      expect(focusFirst).toHaveBeenCalledTimes(1);

      focusBoundary(start, first);
      expect(focusLast).toHaveBeenCalledTimes(1);

      focusBoundary(end, last);
      expect(focusFirst).toHaveBeenCalledTimes(2);

      expect(focusStart).not.toHaveBeenCalled();
      expect(focusEnd).not.toHaveBeenCalled();
    });

    it('should focus the overlay host when there is nothing focusable inside', async () => {
      const { alert, start } = await setup([]);
      const focusHost = jest.spyOn(alert, 'focus');

      focusBoundary(start, null);

      expect(focusHost).toHaveBeenCalled();
    });
  });
});
