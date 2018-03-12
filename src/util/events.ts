import { DomController } from '../platform/dom-controller';
import { Platform } from '../platform/platform';
import { ScrollView } from '../util/scroll-view';
import { Subject, Subscription } from 'rxjs/Rx';

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
 * // first page (publish an event when a user is created)
 * constructor(public events: Events) { }
 *
 * createUser(user) {
 *   console.log('User created!')
 *   events.publish('user:created', { user, time: Date.now() });
 * }
 *
 *
 * // second page (listen for the user created event after function is called)
 * constructor(public events: Events) {
 *   events.subscribe('user:created', ({ user, time }) => {
 *     // user and time are the same arguments passed as keys in `events.publish({ ... })`
 *     console.log('Welcome', user, 'at', time);
 *   });
 * }
 *
 * // third page utilises rxjs interface
 * constructor(public events: Events) {
 *   this.destroyed = new Subject<boolean>();
 *   events.topic('user:created')
 *     .takeUntil(this.destroyed)
 *     .subscribe(({ user, time }) => console.log('Welcome', user, 'at', time));
 * }
 *
 * ```
 * @demo /docs/demos/src/events/
 */
export class Events {
  private _channels: Map<string, Subject<any>> = new Map();

  /**
   * Subscribe to an event topic. Events that get posted to that topic will trigger the provided handler.
   *
   * @param {string} topic the topic to subscribe to
   * @param {function} handler the event handler
   */
  subscribe(topic: string, handler: (value: any) => void): Subscription {
    return this.topic(topic).subscribe(handler);
  }

  /**
   * Publish an event to the given topic.
   *
   * @param {string} topic the topic to publish to
   * @param {any} eventData the data to send as the event
   */
  publish(topic: string, eventData: any = {}) {
    var t = this._channels.get(topic);
    if (!t) {
      return;
    }

    t.next(eventData);
  }

  /**
   * Returns new Observable for the given topic.
   *
   * @param {string} name the topic to retrieve
   * @return {Subject} observable responsible for the given topic
   */
  topic(name: string): Subject<any> {
    let channel = this._channels.get(name);

    if (!channel) {
      channel = new Subject<any>();
      channel.subscribe(null, null, () => this._channels.delete(name))
      this._channels.set(name, channel);
    }

    return channel;
  }
}

/**
 * @hidden
 */
export function setupEvents(plt: Platform, dom: DomController): Events {
  const events = new Events();
  const win = plt.win();
  const doc = plt.doc();

  // start listening for resizes XXms after the app starts
  plt.timeout(() => {
    win.addEventListener('online', (ev) => {
      events.publish('app:online', ev);
    }, false);

    win.addEventListener('offline', (ev) => {
      events.publish('app:offline', ev);
    }, false);

    win.addEventListener('orientationchange', (ev) => {
      events.publish('app:rotated', ev);
    });

    // When that status taps, we respond
    win.addEventListener('statusTap', () => {
      // TODO: Make this more better
      let el = <HTMLElement>doc.elementFromPoint(plt.width() / 2, plt.height() / 2);
      if (!el) { return; }

      let contentEle = <any>el.closest('.scroll-content');
      if (contentEle) {
        var style = contentEle.style;
        var scroll = new ScrollView(null, plt, dom);
        scroll._el = contentEle;
          // We need to stop scrolling if it's happening and scroll up

        style['WebkitBackfaceVisibility'] = 'hidden';
        style['WebkitTransform'] = 'translate3d(0,0,0)';

        dom.write(function() {
          style.overflow = 'hidden';

          function finish() {
            style.overflow = '';
            style['WebkitBackfaceVisibility'] = '';
            style['WebkitTransform'] = '';
          }

          let didScrollTimeout = plt.timeout(() => {
            finish();
          }, 400);

          scroll.scrollTo(0, 0, 300).then(() => {
            plt.cancelTimeout(didScrollTimeout);
            finish();
          });
        });
      }
    });

  }, 2000);

  return events;
}

/**
 * @hidden
 */
export function setupProvideEvents(plt: Platform, dom: DomController) {
  return function() {
    return setupEvents(plt, dom);
  };
}
