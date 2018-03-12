

export function transitionEnd(el: HTMLElement, callback: {(ev?: TransitionEvent): void}) {
  let unRegTrans: Function;
  let unRegWKTrans: Function;
  const opts: any = { passive: true };

  function unregister() {
    unRegWKTrans && unRegWKTrans();
    unRegTrans && unRegTrans();
  }

  function onTransitionEnd(ev: TransitionEvent) {
    if (el === ev.target) {
      unregister();
      callback(ev);
    }
  }

  if (el) {
    el.addEventListener('webkitTransitionEnd', onTransitionEnd, opts);
    unRegWKTrans = function() {
      el.removeEventListener('webkitTransitionEnd', onTransitionEnd, opts);
    };

    el.addEventListener('transitionend', onTransitionEnd, opts);
    unRegTrans = function() {
      el.removeEventListener('transitionend', onTransitionEnd, opts);
    };
  }

  return unregister;
}
