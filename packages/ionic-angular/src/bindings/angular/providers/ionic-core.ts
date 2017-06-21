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
  function now() {
    return win.performance.now();
  }

  const highPromise = Promise.resolve();

  const highCallbacks: Function[] = [];
  const mediumCallbacks: Function[] = [];
  const lowCallbacks: Function[] = [];

  let resolvePending = false;
  let ricPending = false;


  function doHighPriority() {
    // holy geez we need to get this stuff done and fast
    // all high priority callbacks should be fired off immediately
    while (highCallbacks.length > 0) {
      highCallbacks.shift()();
    }
    resolvePending = false;
  }


  function doWork() {
    const start = now();

    // always run all of the high priority work if there is any
    doHighPriority();

    while (mediumCallbacks.length > 0 && (now() - start < 40)) {
      mediumCallbacks.shift()();
    }

    if (mediumCallbacks.length === 0) {
      // we successfully drained the medium queue or the medium queue is empty
      // so now let's drain the low queue with our remaining time
      while (lowCallbacks.length > 0 && (now() - start < 40)) {
        lowCallbacks.shift()();
      }
    }

    // check to see if we still have work to do
    if (ricPending = (mediumCallbacks.length > 0 || lowCallbacks.length > 0)) {
      // everyone just settle down now
      // we already don't have time to do anything in this callback
      // let's throw the next one in a requestAnimationFrame
      // so we can just simmer down for a bit
      zone.runOutsideAngular(() => {
        win.requestAnimationFrame(flush);
      });
    }
  }

  function flush() {
    // always run all of the high priority work if there is any
    doHighPriority();

    // always force a bunch of medium callbacks to run, but still have
    // a throttle on how many can run in a certain time
    const start = now();
    while (mediumCallbacks.length > 0 && (now() - start < 4)) {
      mediumCallbacks.shift()();
    }

    if (ricPending = (mediumCallbacks.length > 0 || lowCallbacks.length > 0)) {
      // still more to do yet, but we've run out of time
      // let's let this thing cool off and try again in the next ric
      zone.runOutsideAngular(() => {
        win.requestAnimationFrame(doWork);
      });
    }
  }

  function add(cb: Function, priority?: number) {
    if (priority === 3) {
      // uses Promise.resolve() for next tick
      highCallbacks.push(cb);

      if (!resolvePending) {
        // not already pending work to do, so let's tee it up
        resolvePending = true;
        highPromise.then(doHighPriority);
      }

    } else {
      if (priority === 1) {
        lowCallbacks.push(cb);

      } else {
        // defaults to medium priority
        // uses requestIdleCallback
        mediumCallbacks.push(cb);
      }

      if (!ricPending) {
        // not already pending work to do, so let's tee it up
        ricPending = true;
        zone.runOutsideAngular(() => {
          win.requestAnimationFrame(doWork);
        });
      }
    }
  }

  return {
    add: add,
    flush: flush
  };
}
