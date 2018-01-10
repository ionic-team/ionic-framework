

export function transitionEnd(elm: HTMLElement, callback: {(ev?: TransitionEvent): void}) {
  let unRegTrans: Function;
  let unRegWKTrans: Function;
  let opts: any = { passive: true };

  function unregister() {
    unRegWKTrans && unRegWKTrans();
    unRegTrans && unRegTrans();
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
    unRegTrans = function() {
      elm.removeEventListener('transitionend', onTransitionEnd, opts);
    };
  }

  return unregister;
}
