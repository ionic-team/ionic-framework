

export function transitionEnd(elm: HTMLElement, callback: {(ev?: TransitionEvent): void}) {
  var unRegTrans: Function;
  var unRegWKTrans: Function;
  var opts: any = { passive: true };

  function unregister() {
    unRegWKTrans && unRegWKTrans();
    unRegWKTrans && unRegTrans();
  }

  function onTransitionEnd(ev: TransitionEvent) {
    if (elm === ev.target) {
      unregister();
      callback(ev);
    }
  }

  if (elm) {
    elm.addEventListener('webkitTransitionEnd', onTransitionEnd, opts);
    unRegWKTrans = function() {
      elm.removeEventListener('webkitTransitionEnd', onTransitionEnd, opts);
    };

    elm.addEventListener('transitionend', onTransitionEnd, opts);
    unRegWKTrans = function() {
      elm.removeEventListener('transitionend', onTransitionEnd, opts);
    };
  }

  return unregister;
}
