export const addEventListener = (
  el: any, // TODO(FW-2832): type
  eventName: string,
  callback: EventListenerOrEventListenerObject,
  opts: {
    passive?: boolean;
    capture?: boolean;
  }
): (() => void) => {
  const listenerOpts = {
    capture: !!opts.capture,
    passive: !!opts.passive,
  };

  let add: string;
  let remove: string;
  if (el['__zone_symbol__addEventListener']) {
    add = '__zone_symbol__addEventListener';
    remove = '__zone_symbol__removeEventListener';
  } else {
    add = 'addEventListener';
    remove = 'removeEventListener';
  }

  el[add](eventName, callback, listenerOpts);
  return () => {
    el[remove](eventName, callback, listenerOpts);
  };
};
