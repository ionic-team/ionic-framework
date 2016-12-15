import { assert } from './util';


// Test via a getter in the options object to see if the passive property is accessed
var supportsOptions = false;
try {
  var opts = Object.defineProperty({}, 'passive', {
    get: function() {
      supportsOptions = true;
    }
  });
  window.addEventListener('psvtst', null, opts);
} catch (e) { }


export function uiEventOptions(useCapture: boolean, usePassive: boolean): any {
  if (supportsOptions && usePassive) {
    return {
      capture: !!useCapture,
      passive: usePassive
    };
  }
  return !!useCapture;
}


export function uiListenEvent(ele: any, eventName: string, zoneWrapped: boolean, option: any, callback: any): Function {
  const rawEvent = (!zoneWrapped && !!ele.__zone_symbol__addEventListener);
  if (rawEvent) {
    ele.__zone_symbol__addEventListener(eventName, callback, option);
    assert(!!ele.__zone_symbol__removeEventListener, 'native removeEventListener does not exist');
    return () => ele.__zone_symbol__removeEventListener(eventName, callback, option);
  }

  ele.addEventListener(eventName, callback, option);
  return () => ele.removeEventListener(eventName, callback, option);
}
