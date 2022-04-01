import { Page } from '@playwright/test';

export const waitForCustomEvent = async (page: Page, eventName: string, timeoutMs = 5000) => {
  const ev = await page.evaluate(({ type, timeout }) => {
    return new Promise<any>((resolve, reject) => {
      const tmr = setTimeout(() => {
        reject(new Error(`waitForCustomEvent() timeout, eventName: ${eventName}`));
      }, timeout);

      window.addEventListener(
        type,
        (event: any) => {
          clearTimeout(tmr);
          resolve((window as any).stencilSerializeEvent(event))
        },
        { once: true }
      )
    });
  }, {
    type: eventName,
    timeout: timeoutMs
  });

  return ev;
}
