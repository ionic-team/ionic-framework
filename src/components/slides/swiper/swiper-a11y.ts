import { Slides } from '../slides';
import { Platform } from '../../../platform/platform';
import { CLS } from './swiper-utils';


export function initA11y(s: Slides, plt: Platform) {
  let unregs: Function[] = [];

  s._liveRegion = plt.doc().createElement('span');
  s._liveRegion.className = CLS.notification;
  s._liveRegion.setAttribute('aria-live', 'assertive');
  s._liveRegion.setAttribute('aria-atomic', 'true');
  s.container.appendChild(s._liveRegion);

  // Setup accessibility
  if (s.nextButton) {
    makeFocusable(s.nextButton);
    addRole(s.nextButton, 'button');
    addLabel(s.nextButton, s.nextSlideMessage);

    plt.registerListener(s.nextButton, 'keydown', (ev: KeyboardEvent) => {
      onEnterKey(s, ev);
    }, { zone: false }, unregs);
  }

  if (s.prevButton) {
    makeFocusable(s.prevButton);
    addRole(s.prevButton, 'button');
    addLabel(s.prevButton, s.prevSlideMessage);

    plt.registerListener(s.prevButton, 'keydown', (ev: KeyboardEvent) => {
      onEnterKey(s, ev);
    }, { zone: false }, unregs);
  }

  return function() {
    unregs.forEach(unreg => {
      unreg();
    });
    unregs = null;

    if (s._liveRegion) {
      s._liveRegion.parentElement.removeChild(s._liveRegion);
    }
  };
}

export function makeFocusable(ele: HTMLElement) {
  ele.setAttribute('tabIndex', '0');
}

export function addRole(ele: HTMLElement, role: string) {
  ele.setAttribute('role', role);
}

export function addLabel(ele: HTMLElement, label: string) {
  ele.setAttribute('aria-label', label);
}

export function ariaDisable(ele: HTMLElement, isDisabled: boolean) {
  if (isDisabled) {
    ele.setAttribute('aria-disabled', 'true');
  } else if (ele.hasAttribute('aria-disabled')) {
    ele.removeAttribute('aria-disabled');
  }
}

export function ariaHidden(ele: HTMLElement, isHidden: boolean) {
  if (isHidden) {
    ele.setAttribute('aria-hidden', 'true');
  } else if (ele.hasAttribute('aria-hidden')) {
    ele.removeAttribute('aria-hidden');
  }
}

function onEnterKey(_: Slides, __: KeyboardEvent) {
  // if (event.keyCode !== 13) return;

  // const target: HTMLElement = <any>event.target;

  // if (target.classList.contains(PARAMS.nextButtonClass)) {
  //   if (s.isEnd) {
  //     notify(s, PARAMS.lastSlideMessage);
  //   } else {
  //     notify(s, PARAMS.nextSlideMessage);
  //   }

  // } else if (target.classList.contains(PARAMS.prevButtonClass)) {
  //   if (s.isBeginning) {
  //     notify(s, PARAMS.firstSlideMessage);
  //   } else {
  //     notify(s, PARAMS.prevSlideMessage);
  //   }
  // }

}


// function notify(s: Slides, message: string) {
//   var notification = s._liveRegion;
//   if (notification) {
//     notification.innerHTML = message || '';
//   }
// }
