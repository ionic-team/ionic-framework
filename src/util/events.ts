import { nativeTimeout } from '../util/dom';
import { Platform } from '../platform/platform';
import { ScrollView } from '../util/scroll-view';

/**
 * @name Events
 * @description
 * Events is a publish-subscribe style event system for sending and responding to application-level
 * events across your app.
 *
 * @usage
 * ```ts
 * import { Events } from 'ionic-angular';
 *
 * constructor(public events: Events) {}
 *
 * // first page (publish an event when a user is created)
 * function createUser(user) {
 *   console.log('User created!')
 *   events.publish('user:created', user);
 * }
 *
 * // second page (listen for the user created event)
 * events.subscribe('user:created', (userEventData) => {
 *   // userEventData is an array of parameters, so grab our first and only arg
 *   console.log('Welcome', userEventData[0]);
 * });
 *
 * ```
 * @demo /docs/v2/demos/src/events/
 */
export class Events {
  private _channels: Array<any> = [];

  /**
   * Subscribe to an event topic. Events that get posted to that topic will trigger the provided handler.
   *
   * @param {string} topic the topic to subscribe to
   * @param {function} handler the event handler
   */
  subscribe(topic: string, ...handlers: Function[]) {
    if (!this._channels[topic]) {
      this._channels[topic] = [];
    }
    handlers.forEach((handler) => {
      this._channels[topic].push(handler);
    });
  }

  /**
   * Unsubscribe from the given topic. Your handler will no longer receive events published to this topic.
   *
   * @param {string} topic the topic to unsubscribe from
   * @param {function} handler the event handler
   *
   * @return true if a handler was removed
   */
  unsubscribe(topic: string, handler: Function) {
    let t = this._channels[topic];
    if (!t) {
      // Wasn't found, wasn't removed
      return false;
    }

    if (!handler) {
      // Remove all handlers for this topic
      delete this._channels[topic];
      return true;
    }

    // We need to find and remove a specific handler
    let i = t.indexOf(handler);

    if (i < 0) {
      // Wasn't found, wasn't removed
      return false;
    }

    t.splice(i, 1);

    // If the channel is empty now, remove it from the channel map
    if (!t.length) {
      delete this._channels[topic];
    }

    return true;
  }

  /**
   * Publish an event to the given topic.
   *
   * @param {string} topic the topic to publish to
   * @param {any} eventData the data to send as the event
   */
  publish(topic: string, ...args: any[]) {
    var t = this._channels[topic];
    if (!t) {
      return null;
    }

    let responses: any[] = [];
    t.forEach((handler: any) => {
      responses.push(handler(args));
    });
    return responses;
  }
}

/**
 * @private
 */
export function setupEvents(platform: Platform): Events {
  const events = new Events();

  // start listening for resizes XXms after the app starts
  nativeTimeout(() => {
    window.addEventListener('online', (ev) => {
      events.publish('app:online', ev);
    }, false);

    window.addEventListener('offline', (ev) => {
      events.publish('app:offline', ev);
    }, false);

    window.addEventListener('orientationchange', (ev) => {
      events.publish('app:rotated', ev);
    });

    // When that status taps, we respond
    window.addEventListener('statusTap', (ev) => {
      // TODO: Make this more better
      let el = <HTMLElement>document.elementFromPoint(platform.width() / 2, platform.height() / 2);
      if (!el) { return; }

      let content = <HTMLElement>el.closest('.scroll-content');
      if (content) {
        var scroll = new ScrollView(content);
        scroll.scrollTo(0, 0, 300);
      }
    });

    window.addEventListener('resize', () => {
      platform.windowResize();
    });

  }, 2000);

  return events;
}

/**
 * @private
 */
export function setupProvideEvents(platform: Platform) {
  return function() {
    return setupEvents(platform);
  };
}
