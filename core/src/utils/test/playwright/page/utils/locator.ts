import type { Locator } from '@playwright/test';

import type { E2EPage } from '../../playwright-declarations';
import { EventSpy, addE2EListener } from '../event-spy';

export type LocatorOptions = {
  hasText?: string | RegExp;
  has?: Locator;
};

export interface E2ELocator extends Locator {
  spyOnEvent: (eventName: string) => void;
}

export const locator = (page: E2EPage, originalFn: typeof page.locator, selector: string, options?: LocatorOptions): E2ELocator => {
  const locator = originalFn(selector, options) as E2ELocator;
  locator.spyOnEvent = async (eventName: string) => {
    const spy = new EventSpy(eventName);
    const handle = await locator.evaluateHandle((node: HTMLElement) => node);
    await addE2EListener(page, handle, eventName, (ev: CustomEvent) => spy.push(ev));
    return spy;
  }
  return locator as E2ELocator;
}
