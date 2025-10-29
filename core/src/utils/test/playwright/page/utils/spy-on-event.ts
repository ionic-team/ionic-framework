import type { E2EPage } from '../../playwright-declarations';
import { addE2EListener, EventSpy } from '../event-spy';

export const spyOnEvent = async (page: E2EPage, eventName: string): Promise<EventSpy> => {
  /**
   * Tabbing out of the page boundary can lead to unreliable `ionBlur events,
   * particularly in Firefox.
   *
   * This occurs because Playwright may incorrectly maintain focus state on the
   * last element, even after a Tab press attempts to shift focus outside the
   * viewport. To reliably trigger the necessary blur event, add a visually
   * hidden, focusable element at the end of the page to receive focus instead of
   * the browser.
   *
   * Playwright issue reference:
   * https://github.com/microsoft/playwright/issues/32269
   */
  if (eventName === 'ionBlur') {
    const hiddenInput = await page.$('#hidden-input-for-ion-blur');
    if (!hiddenInput) {
      await page.evaluate(() => {
        const input = document.createElement('input');
        input.id = 'hidden-input-for-ion-blur';
        input.style.position = 'absolute';
        input.style.opacity = '0';
        input.style.height = '0';
        input.style.width = '0';
        input.style.pointerEvents = 'none';
        document.body.appendChild(input);

        // Clean up the element when the page is unloaded.
        window.addEventListener('unload', () => {
          input.remove();
        });
      });
    }
  }

  const spy = new EventSpy(eventName);

  const handle = await page.evaluateHandle(() => window);

  await addE2EListener(page, handle, eventName, (ev: CustomEvent) => spy.push(ev));

  return spy;
};
