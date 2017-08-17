import { PointerEvents, PointerEventsConfig } from './pointer-events';
import { EventListenerOptions, Platform } from '../platform/platform';


/**
 * @hidden
 */
export class UIEventManager {
  private evts: Function[] = [];

  constructor(public plt: Platform) {}

  pointerEvents(config: PointerEventsConfig): PointerEvents {
    if (!config.element || !config.pointerDown) {
      console.error('PointerEvents config is invalid');
      return;
    }

    const eventListnerOpts: EventListenerOptions = {
      capture: config.capture,
      passive: config.passive,
      zone: config.zone
    };

    const pointerEvents = new PointerEvents(
      this.plt,
      config.element,
      config.pointerDown,
      config.pointerMove,
      config.pointerUp,
      eventListnerOpts);

    const removeFunc = () => pointerEvents.destroy();
    this.evts.push(removeFunc);
    return pointerEvents;
  }

  listen(ele: any, eventName: string, callback: any, opts: EventListenerOptions): Function {
    if (ele) {
      var removeFunc = this.plt.registerListener(ele, eventName, callback, opts);
      this.evts.push(removeFunc);
      return removeFunc;
    }
  }

  unlistenAll() {
    this.evts.forEach(unRegEvent => {
      unRegEvent();
    });
    this.evts.length = 0;
  }

  destroy() {
    this.unlistenAll();
    this.evts = null;
  }
}
