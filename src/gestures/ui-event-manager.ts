import { PointerEvents, PointerEventsConfig } from './pointer-events';
import { Platform, EventListenerOptions } from '../platform/platform';


/**
 * @private
 */
export class UIEventManager {
  private evts: Function[] = [];

<<<<<<< HEAD
  constructor(public platform: Platform) {}
=======
  constructor(public plt: Platform) {}
>>>>>>> swiper-modules

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
<<<<<<< HEAD
      this.platform,
=======
      this.plt,
>>>>>>> swiper-modules
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
<<<<<<< HEAD
      var removeFunc = this.platform.addListener(ele, eventName, callback, opts);
=======
      var removeFunc = this.plt.addListener(ele, eventName, callback, opts);
>>>>>>> swiper-modules
      this.evts.push(removeFunc);
      return removeFunc;
    }
  }

  destroy() {
    this.evts.forEach(unRegEvent => {
      unRegEvent();
    });
    this.evts.length = 0;
  }
}
