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
    ionic['NextTickCtrl'] = getNextTickController(zone, plt.userAgent().toLowerCase());

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


function getNextTickController(zone: NgZone, ua: string) {
  /* Adopted from Vue.js, MIT, https://github.com/vuejs/vue */
  const callbacks: Function[] = [];
  const isIOS = /iphone|ipad|ipod|ios/.test(ua);
  const noop = () => {};
  const promise = Promise.resolve();
  const logError = (err: any) => { console.error(err); };
  let pending = false;


  function nextTickHandler() {
    pending = false;
    const copies = callbacks.slice(0);

    callbacks.length = 0;
    for (let i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  function promiseTick() {
    zone.runOutsideAngular(() => {
      promise.then(nextTickHandler).catch(logError);
      // in problematic UIWebViews, Promise.then doesn't completely break, but
      // it can get stuck in a weird state where callbacks are pushed into the
      // microtask queue but the queue isn't being flushed, until the browser
      // needs to do some other work, e.g. handle a timer. Therefore we can
      // "force" the microtask queue to be flushed by adding an empty timer.
      if (isIOS) setTimeout(noop);
    });
  }

  function queueNextTick(cb: Function) {
    callbacks.push(cb);

    if (!pending) {
      pending = true;
      promiseTick();
    }
  }

  return {
    nextTick: queueNextTick
  };
}
