
export function transitionEnd(el: HTMLElement | null, callback: (ev?: TransitionEvent) => void) {
  let unRegTrans: (() => void) | undefined;
  const opts: any = { passive: true };

  function unregister() {
    if (unRegTrans) {
      unRegTrans();
    }
  }

  function onTransitionEnd(ev: Event) {
    if (el === ev.target) {
      unregister();
      callback(ev as TransitionEvent);
    }
  }

  if (el) {
    el.addEventListener('webkitTransitionEnd', onTransitionEnd, opts);
    el.addEventListener('transitionend', onTransitionEnd, opts);

    unRegTrans = () => {
      el.removeEventListener('webkitTransitionEnd', onTransitionEnd, opts);
      el.removeEventListener('transitionend', onTransitionEnd, opts);
    };
  }

  return unregister;
}
