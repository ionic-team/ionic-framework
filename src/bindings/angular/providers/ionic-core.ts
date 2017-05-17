import { Config } from '../../../config/config';
import { DomController } from '../../../platform/dom-controller';
import { NgZone } from '@angular/core';
import { Platform } from '../../../platform/platform';


/**
 * @hidden
 */
export function setupCore(config: Config, plt: Platform, domCtrl: DomController, zone: NgZone) {
  return function() {
    const win: any = plt.win();
    const doc = plt.doc();

    const ionic: any = win['Ionic'];

    if (!ionic || !ionic['staticDir']) {
      // window.Ionic should already exist and
      // window.Ionic.staticDir should have been added to the
      // main bundle referencing the static www build directory
      return;
    }

    // same controllers are used by ionic core
    ionic['ConfigCtrl'] = config;

    // keep core and angular dom reads/writes *nsync
    ionic['DomCtrl'] = domCtrl;

    // next tick controller created here so that it can
    // be created to run outside of angular
    ionic['QueueCtrl'] = getQueueController(win, zone);

    // keep core and angular dom reads/writes *nsync
    ionic['eventNameFn'] = function(eventName: string) {
      return '$' + eventName;
    };

    // build up a path for the exact ionic core javascript file this browser needs
    var pathItems: string[] = ['core'];

    if (!('attachShadow' in Element.prototype)) {
      // browser requires the shadow dom polyfill
      pathItems.push('sd');
    }

    if (!win.customElements) {
      // browser requires the custom elements polyfill
      pathItems.push('ce');
    }

    // request the ionic core file this browser needs
    var s = doc.createElement('script');
    s.src = `${ionic['staticDir']}ionic.${pathItems.join('.')}.js`;
    doc.head.appendChild(s);

    return {};
  };
}


function getQueueController(win: any, zone: NgZone) {
  const hostScheduleDefer: Function = win['requestIdleCallback'];
  const callbacks: Function[] = [];
  let pending = false;

  function doWork(deadlineObj: any) {
    // let's see if we've got time to take care of things
    while (deadlineObj.timeRemaining() > 1 && callbacks.length > 0) {
      // do some work while within the allowed time
      // shift the array and fire off the callbacks from the beginning
      // once we run out of time or callbacks we'll stop
      callbacks.shift()();
    }

    // check to see if we still have work to do
    if (pending = (callbacks.length > 0)) {
      // everyone just settle down now
      // we already don't have time to do anything in this callback
      // let's throw the next one in a requestAnimationFrame
      // so we can just simmer down for a bit
      zone.runOutsideAngular(() => {
        requestAnimationFrame(flush);
      });
    }
  }

  function flush() {
    // always force a bunch of callbacks to run, but still have
    // a throttle on how many can run in a certain time
    const start = performance.now();
    while (callbacks.length > 0 && (performance.now() - start < 4)) {
      callbacks.shift()();
    }

    if (pending = (callbacks.length > 0)) {
      // still more to do yet, but we've run out of time
      // let's let thing cool off and try again after a raf
      zone.runOutsideAngular(() => {
        hostScheduleDefer(doWork);
      });
    }
  }

  function add(cb: Function) {
    // add the work to the end of the callbacks
    callbacks.push(cb);

    if (!pending) {
      // not already pending work to do, so let's tee it up
      pending = true;
      zone.runOutsideAngular(() => {
        hostScheduleDefer(doWork);
      });
    }
  }

  return {
    add: add,
    flush: flush
  };
}
