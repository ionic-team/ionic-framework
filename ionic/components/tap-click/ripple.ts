import {Activator} from './activator';
import {raf, removeElement} from '../../util/dom';
import {Animation} from '../../animations/animation';


export class RippleActivator extends Activator {

  constructor(app, config) {
    super(app, config);
    this.ripples = {};
  }

  downAction(targetEle, pointerX, pointerY) {
    super.downAction(targetEle, pointerX, pointerY);

    if (!isRippleElement(targetEle)) return;

    // create a new ripple element
    let r = targetEle.getBoundingClientRect();
    let x = Math.max(Math.abs(r.width - pointerX), pointerX) * 2;
    let y = Math.max(Math.abs(r.height - pointerY), pointerY) * 2;
    let size = (Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))) - 10;

    let rippleEle = document.createElement('md-ripple');
    let eleStyle = rippleEle.style;
    eleStyle.width = size + 'px';
    eleStyle.height = size + 'px';
    eleStyle.marginTop = -(size / 2) + 'px';
    eleStyle.marginLeft = -(size / 2) + 'px';
    eleStyle.left = (pointerX - r.left) + 'px';
    eleStyle.top = (pointerY - r.top) + 'px';

    targetEle.appendChild(rippleEle);

    let ripple = this.ripples[Date.now()] = { ele: rippleEle };

    // expand the circle from the users starting point
    // start slow, and when they let up, then speed up the animation
    ripple.expand = new Animation(rippleEle, {renderDelay: 0});
    ripple.expand
      .fromTo('scale', '0.001', '1')
      .duration(300)
      .playbackRate(0.35)
      .onFinish(()=> {
        // finished expanding
        ripple.expand && ripple.expand.dispose();
        ripple.expand = null;
        ripple.expanded = true;
        this.next();
      })
      .play();

      this.next();
  }

  upAction() {
    this.deactivate();

    let ripple;
    for (let rippleId in this.ripples) {
      ripple = this.ripples[rippleId];

      if (!ripple.fade) {
        // ripple has not been let up yet
        // spped up the rate if the animation is still going
        setTimeout(() => {
          ripple.expand && ripple.expand.playbackRate(1);
          ripple.fade = new Animation(ripple.ele);
          ripple.fade
            .fadeOut()
            .duration(750)
            .onFinish(() => {
              ripple.fade && ripple.fade.dispose();
              ripple.fade = null;
              ripple.faded = true;
              this.next();
            })
            .play();

          }, 16);
      }
    }

    this.next();
  }

  next(forceComplete) {
    let ripple, rippleEle;
    for (let rippleId in this.ripples) {
      ripple = this.ripples[rippleId];

      if ((ripple.expanded && ripple.faded && ripple.ele) ||
        forceComplete ||
        parseInt(rippleId) + 5000 < Date.now()) {
        // finished expanding and the user has lifted the pointer
        ripple.expand && ripple.expand.dispose();
        ripple.fade && ripple.fade.dispose();
        removeElement(ripple.ele);
        ripple.ele = ripple.expand = ripple.fade = null;
        delete this.ripples[rippleId];
      }
    }
  }

  clearState() {
    this.deactivate();
    this.next(true);
  }

}


function isRippleElement(targetEle) {
  return (targetEle && targetEle.parentNode && !(NO_RIPPLE_TAGNAMES.test(targetEle.tagName)));
}

const NO_RIPPLE_TAGNAMES = /BACKDROP/;
