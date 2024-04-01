import type { JSHandle } from '@playwright/test';

import type { E2EPage } from '../playwright-declarations';

/**
 * The EventSpy class allows
 * developers to listen for
 * a particular event emission and
 * pass/fail the test based on whether
 * or not the event was emitted.
 * Based off https://github.com/ionic-team/stencil/blob/16b8ea4dabb22024872a38bc58ba1dcf1c7cc25b/src/testing/puppeteer/puppeteer-events.ts#L64
 */
export class EventSpy {
  /**
   * Keeping track of a cursor
   * ensures that no two spy.next()
   * calls point to the same event.
   */
  private cursor = 0;
  private queuedHandler: (() => void)[] =
    [];
  public events: CustomEvent[] = [];

  constructor(
    public eventName: string
  ) {}

  get length() {
    return this.events.length;
  }

  get firstEvent() {
    return this.events[0] ?? null;
  }

  get lastEvent() {
    return (
      this.events[
        this.events.length - 1
      ] ?? null
    );
  }

  public next() {
    const { cursor } = this;
    this.cursor++;

    const next = this.events[cursor];
    if (next !== undefined) {
      return Promise.resolve(next);
    } else {
      /**
       * If the event has not already been
       * emitted, then add it to the queuedHandler.
       * When the event is emitted, the push
       * method is called which results in the
       * Promise below being resolved.
       */
      let resolve: () => void;
      const promise = new Promise<void>(
        (r) => (resolve = r)
      );
      // @ts-ignore
      this.queuedHandler.push(resolve);

      return promise.then(
        () => this.events[cursor]
      );
    }
  }

  public push(ev: CustomEvent) {
    this.events.push(ev);
    const next =
      this.queuedHandler.shift();
    if (next) {
      next();
    }
  }
}

/**
 * Initializes information required to
 * spy on events.
 * The ionicOnEvent function is called in the
 * context of the current page. This lets us
 * respond to an event listener created within
 * the page itself.
 */
export const initPageEvents = async (
  page: E2EPage
) => {
  page._e2eEventsIds = 0;
  page._e2eEvents = new Map();

  await page.exposeFunction(
    'ionicOnEvent',
    (id: number, ev: any) => {
      const context =
        page._e2eEvents.get(id);
      if (context) {
        context.callback(ev);
      }
    }
  );
};

/**
 * Adds a new event listener in the current
 * page context to updates the _e2eEvents map
 * when an event is fired.
 */
export const addE2EListener = async (
  page: E2EPage,
  elmHandle: JSHandle,
  eventName: string,
  callback: (ev: any) => void
) => {
  const id = page._e2eEventsIds++;
  page._e2eEvents.set(id, {
    eventName,
    callback,
  });

  await elmHandle.evaluate(
    (elm, [eventName, id]) => {
      (
        window as any
      ).stencilSerializeEventTarget = (
        target: any
      ) => {
        // BROWSER CONTEXT
        if (!target) {
          return null;
        }
        if (target === window) {
          return {
            serializedWindow: true,
          };
        }
        if (target === document) {
          return {
            serializedDocument: true,
          };
        }
        if (target.nodeType != null) {
          const serializedElement: any =
            {
              serializedElement: true,
              nodeName: target.nodeName,
              nodeValue:
                target.nodeValue,
              nodeType: target.nodeType,
              tagName: target.tagName,
              className:
                target.className,
              id: target.id,
            };
          return serializedElement;
        }
        return null;
      };

      (
        window as any
      ).serializeStencilEvent = (
        orgEv: CustomEvent
      ) => {
        const serializedEvent = {
          bubbles: orgEv.bubbles,
          cancelBubble:
            orgEv.cancelBubble,
          cancelable: orgEv.cancelable,
          composed: orgEv.composed,
          currentTarget: (
            window as any
          ).stencilSerializeEventTarget(
            orgEv.currentTarget
          ),
          defaultPrevented:
            orgEv.defaultPrevented,
          detail: orgEv.detail,
          eventPhase: orgEv.eventPhase,
          isTrusted: orgEv.isTrusted,
          returnValue:
            orgEv.returnValue,
          srcElement: (
            window as any
          ).stencilSerializeEventTarget(
            orgEv.srcElement
          ),
          target: (
            window as any
          ).stencilSerializeEventTarget(
            orgEv.target
          ),
          timeStamp: orgEv.timeStamp,
          type: orgEv.type,
          isSerializedEvent: true,
        };
        return serializedEvent;
      };

      elm.addEventListener(
        eventName as string,
        (ev: Event) => {
          (window as any).ionicOnEvent(
            id,
            (
              window as any
            ).serializeStencilEvent(ev)
          );
        }
      );
    },
    [eventName, id]
  );
};
