import type { TypedInputEvent } from '../types/mask-interface';

/**
 * Event listener utility class that simplifies teardown of
 * manually added event listeners.
 * @internal
 *
 * Original design by Tinkoff:
 * @see https://github.com/Tinkoff/maskito/blob/main/projects/core/src/lib/utils/dom/event-listener.ts
 */
export class EventListener {
  private readonly listeners: (() => void)[] = [];

  constructor(private readonly element: HTMLElement) {}

  listen<E extends keyof HTMLElementEventMap>(
    eventType: E,
    fn: (event: E extends 'beforeinput' ? TypedInputEvent : HTMLElementEventMap[E]) => unknown,
    options?: AddEventListenerOptions
  ): void {
    const untypedFn = fn as (event: HTMLElementEventMap[E]) => unknown;

    this.element.addEventListener<E>(eventType, untypedFn, options);
    this.listeners.push(() => this.element.removeEventListener(eventType, untypedFn));
  }

  destroy(): void {
    this.listeners.forEach((removeListener) => removeListener());
  }
}
