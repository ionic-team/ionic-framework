const win: any = window;

// RequestAnimationFrame Polyfill (Android 4.3 and below)
/*! @author Paul Irish */
/*! @source https://gist.github.com/paulirish/1579671 */
(function() {
  var rafLastTime = 0;
  if (!win.requestAnimationFrame) {
    win.requestAnimationFrame = function(callback: Function) {
      var currTime = Date.now();
      var timeToCall = Math.max(0, 16 - (currTime - rafLastTime));

      var id = win.setTimeout(function() {
        callback(currTime + timeToCall);
      }, timeToCall);

      rafLastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!win.cancelAnimationFrame) {
    win.cancelAnimationFrame = function(id: number) { clearTimeout(id); };
  }
})();

// use native raf rather than the zone wrapped one
const originalRaf = (win[win['Zone']['__symbol__']('requestAnimationFrame')] || win[win['Zone']['__symbol__']('webkitRequestAnimationFrame')]);
// if the originalRaf from the Zone symbol is not available, we need to provide the polyfilled version
export const nativeRaf: {(callback: Function): number} = originalRaf !== undefined ? originalRaf['bind'](win) : win.requestAnimationFrame.bind(win);

// zone wrapped raf
export const raf: {(callback: Function): number} = win.requestAnimationFrame.bind(win);
export const cancelRaf: {(handle: number): void} = win.cancelAnimationFrame.bind(win);

export const nativeTimeout: {(handler: Function, timeout: number): number} = win[win['Zone']['__symbol__']('setTimeout')]['bind'](win);
export const clearNativeTimeout: {(handle: number): void} = win[win['Zone']['__symbol__']('clearTimeout')]['bind'](win);

/**
 * Run a function in an animation frame after waiting `framesToWait` frames.
 *
 * @param framesToWait number how many frames to wait
 * @param callback Function the function call to defer
 * @return Function a function to call to cancel the wait
 */
export function rafFrames(framesToWait: number, callback: Function) {
  framesToWait = Math.ceil(framesToWait);
  let rafId: any;
  let timeoutId: any;

  if (framesToWait === 0) {
    callback();

  } else if (framesToWait < 2) {
    rafId = nativeRaf(callback);

  } else {
    timeoutId = nativeTimeout(() => {
      rafId = nativeRaf(callback);
    }, (framesToWait - 1) * 16.6667);
  }

  return function() {
    clearNativeTimeout(timeoutId);
    cancelRaf(rafId);
  };
}

// TODO: DRY rafFrames and zoneRafFrames
export function zoneRafFrames(framesToWait: number, callback: Function) {
  framesToWait = Math.ceil(framesToWait);

  if (framesToWait === 0) {
    callback();

  } else if (framesToWait < 2) {
    raf(callback);

  } else {
    setTimeout(() => {
      raf(callback);
    }, (framesToWait - 1) * 16.6667);
  }
}

export function windowLoad(callback: Function) {
  if (document.readyState === 'complete') {
    callback();

  } else {
    win.addEventListener('load', completed, false);
  }

  function completed() {
    win.removeEventListener('load', completed, false);
    callback();
  }
}


export function windowDimensions(): WindowDimensions {
  if (!winDimensions.innerWidth) {
    // make sure we got good values before caching
    if (win.innerWidth && win.innerHeight) {
      winDimensions.innerWidth = win.innerWidth;
      winDimensions.innerHeight = win.innerHeight;
      winDimensions.screenWidth = win.screen.width;
      winDimensions.screenHeight = win.screen.height;

    } else {
      // do not cache bad values
      return {};
    }
  }
  return winDimensions;
}

export function flushDimensionCache() {
  winDimensions = {};
}

let winDimensions: WindowDimensions = {};

export interface WindowDimensions {
  innerWidth?: number;
  innerHeight?: number;
  screenWidth?: number;
  screenHeight?: number;
}
