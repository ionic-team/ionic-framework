import { ComponentRef } from '@angular/core';

export function runTransition(enteringRef: ComponentRef<any>, leavingRef: ComponentRef<any>): Promise<void> {
  const enteringElm = (enteringRef && enteringRef.location && enteringRef.location.nativeElement);
  const leavingElm = (leavingRef && leavingRef.location && leavingRef.location.nativeElement);

  if (!enteringElm && !leavingElm) {
    return Promise.resolve();
  }

  return tr(enteringElm, leavingElm);
}


function tr(enteringElm: HTMLElement, leavingElm: HTMLElement): Promise<void> {
  console.log('transition start');

  return new Promise(resolve => {

    setTimeout(() => {

      if (enteringElm) {
        enteringElm.classList.add('show-page');
      }

      if (leavingElm) {
        leavingElm.classList.remove('show-page');
      }

      resolve();
    }, 750);
  });
}
