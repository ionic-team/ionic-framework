import { Slides } from '../slides';
import { Platform } from '../../../platform/platform';


export function initA11y(s: Slides, plt: Platform) {
  let unregs: Function[] = [];

  s.liveRegion = plt.doc().createElement('span');
  s.liveRegion.className = s.params.notificationClass;
  s.liveRegion.setAttribute('aria-live', 'assertive');
  s.liveRegion.setAttribute('aria-atomic', 'true');
  s.container.appendChild(s.liveRegion);

  // Setup accessibility
  if (s.params.nextButton && s.nextButton) {
    makeFocusable(s.nextButton);
    addRole(s.nextButton, 'button');
    addLabel(s.nextButton, s.params.nextSlideMessage);

    plt.addListener(s.nextButton, 'keydown', (ev: KeyboardEvent) => {
      onEnterKey(s, ev);
    }, { zone: false }, unregs);
  }

  if (s.params.prevButton && s.prevButton) {
    makeFocusable(s.prevButton);
    addRole(s.prevButton, 'button');
    addLabel(s.prevButton, s.params.prevSlideMessage);

    plt.addListener(s.prevButton, 'keydown', (ev: KeyboardEvent) => {
      onEnterKey(s, ev);
    }, { zone: false }, unregs);
  }

  return function() {
    unregs.forEach(unreg => {
      unreg();
    });
    unregs = null;

    if (s.liveRegion) {
      s.liveRegion.parentElement.removeChild(s.liveRegion);
    }
  };
}

function makeFocusable(ele: HTMLElement) {
  ele.setAttribute('tabIndex', '0');
}

function addRole(ele: HTMLElement, role: string) {
  ele.setAttribute('role', role);
}

function addLabel(ele: HTMLElement, label) {
  ele.setAttribute('aria-label', label);
}

export function a11yDisable(ele: HTMLElement) {
  ele.setAttribute('aria-disabled', 'true');
}

export function a11yEnable(ele: HTMLElement) {
  ele.setAttribute('aria-disabled', 'false');
}

function onEnterKey(s: Slides, event: KeyboardEvent) {
  if (event.keyCode !== 13) return;

  const target: HTMLElement = <any>event.target;

  if (target.classList.contains(s.params.nextButton)) {
    if (s.isEnd) {
      notify(s, s.params.lastSlideMessage);
    } else {
      notify(s, s.params.nextSlideMessage);
    }

  } else if (target.classList.contains(s.params.prevButton)) {
    if (s.isBeginning) {
      notify(s, s.params.firstSlideMessage);
    } else {
      notify(s, s.params.prevSlideMessage);
    }
  }

  if (target.classList.contains(s.params.bulletClass)) {
    target.click();
  }
}


function notify(s: Slides, message: string) {
  var notification = s.liveRegion;
  if (notification) {
    notification.innerHTML = message || '';
  }
}

export function a11yInitPagination(s: Slides) {
  if (s.params.pagination && s.params.paginationClickable && s.bullets && s.bullets.length) {
    for (var i = 0; i < s.bullets.length; i++) {
      var bullet = s.bullets[i];
      makeFocusable(bullet);
      addRole(bullet, 'button');
      addLabel(bullet, s.params.paginationBulletMessage.replace(/{{i}}/, <any>(i + 1)));
    }
  }
}
