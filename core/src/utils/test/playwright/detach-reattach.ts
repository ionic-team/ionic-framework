import type { Locator } from '@playwright/test';

/**
 * Detaches an element and puts it back in a later task, the way a framework
 * binding relocates a subtree it owns.
 *
 * A single `appendChild` won't do it. Custom element reactions run at the end
 * of the same task, so `disconnectedCallback` fires with the element already
 * back and nothing tears down. The detach has to survive a task before the
 * disconnect is observable.
 *
 * Pass `containerSelector` to hold the element somewhere other than the body.
 */
export const detachAndReattach = async (locator: Locator, containerSelector = 'body') => {
  await locator.evaluate(async (el: HTMLElement, selector: string) => {
    const holder = document.createElement('div');
    document.querySelector(selector)!.appendChild(holder);
    el.remove();
    await new Promise((resolve) => setTimeout(resolve, 0));
    holder.appendChild(el);
  }, containerSelector);
};
