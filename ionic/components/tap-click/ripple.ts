import {Activator} from './activator';
import {raf, transitionEnd} from '../../util/dom';


export class RippleActivator extends Activator {

  constructor(app, config) {
    super(app, config);
  }

  downAction(targetEle, pointerX, pointerY) {
    super.downAction(targetEle, pointerX, pointerY, (targetEle) => {

      if (!targetEle || !targetEle.parentNode || NO_RIPPLE_TAGNAMES.test(targetEle.tagName)) return;

      // clean out any existing ripple elements
      removeAll(targetEle);

      // create a new ripple element
      let r = targetEle.getBoundingClientRect();
      let rippleSize = Math.sqrt(r.width * r.width + r.height * r.height) * 2 + 2;

      let rippleEle = document.createElement('md-ripple');
      rippleEle.style.width = rippleSize + 'px';
      rippleEle.style.height = rippleSize + 'px';
      rippleEle.style.marginTop = -(rippleSize / 2) + 'px';
      rippleEle.style.marginLeft = -(rippleSize / 2) + 'px';
      rippleEle.style.left = (pointerX - r.left) + 'px';
      rippleEle.style.top = (pointerY - r.top) + 'px';

      targetEle.appendChild(rippleEle);

      transitionEnd(rippleEle).then(ev => {
        // the ripple animation has ended
        ev.target.dataset.expanded = true;
        fadeOutRipple(ev.target);
      });

      // kick off animaiton
      raf(() => {
        rippleEle.classList.add('ripple-expand');
      });
    });
  }

  upAction(ev) {
    // the user was pressing down, then just let up
    super.upAction(ev);

    // immediately remove the activated css class and clear the queue
    // this stops the background from changing colors, not stop the ripple
    this.queue = {};

    if (ev && ev.target) {
      raf(() => {
        let targetEle = ev.target;
        if (targetEle && targetEle.parentNode) {
          targetEle.classList.remove(this.activatedClass);

          let rippleElements = getRippleElements(targetEle);
          for (let i = 0, l = rippleElements.length; i < l; i++) {
            rippleElements[i].dataset.pointerUp = true;
            fadeOutRipple(rippleElements[i]);
          }
        }
      });
    }
  }

  clearState(ev) {
    super.clearState(ev);
    if (ev && ev.target) {
      removeAll(ev.target);
    }
  }

}

function fadeOutRipple(rippleEle) {
  if (rippleEle && rippleEle.dataset.pointerUp && rippleEle.dataset.expanded && !rippleEle.dataset.removing) {

    transitionEnd(rippleEle).then(ev => {
      // the ripple has faded out completely
      let rippleEle = ev.target;
      if (rippleEle.parentNode) {
        rippleEle.parentNode.removeChild(rippleEle);
      }
    });

    // start fading out the ripple
    rippleEle.classList.add('ripple-fade-out');
    rippleEle.dataset.removing = true;
  }
}

function removeAll(targetEle) {
  let rippleElements = getRippleElements(targetEle);
  for (let i = 0; i < rippleElements.length; i++) {
    rippleElements[i].dataset.pointerUp = rippleElements[i].dataset.expanded = true;
    fadeOutRipple(rippleElements[i]);
  }
}

function getRippleElements(containerEle) {
  return containerEle && containerEle.querySelectorAll('md-ripple');
}

const NO_RIPPLE_TAGNAMES = /BACKDROP/;
