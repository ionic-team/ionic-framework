import {Activator} from './activator';
import {removeElement, raf} from '../../util/dom';
import {Animation} from '../../animations/animation';


export class RippleActivator extends Activator {
  static TOUCH_DOWN_ACCEL = 512;
  static TOUCH_UP_ACCEL = 1024;
  static OPACITY_DECAY_VEL = 1.6;
  static OUTER_OPACITY_VEL = 1.2;

  static OPACITY_OUT_DURATION = 750;

  static EXPAND_OUT_PLAYBACK_RATE = 3.5;
  static DOWN_PLAYBACK_RATE = 0.65;
  static OPACITY_OUT_PLAYBACK_RATE = 1;

  constructor(app, config) {
    super(app, config);
    this.ripples = {};
  }

  downAction(targetEle, pointerX, pointerY) {
    super.downAction(targetEle, pointerX, pointerY);

    if (!isRippleElement(targetEle)) return;

    // create a new ripple element
    let r = targetEle.getBoundingClientRect();
    let w = r.width;
    let h = r.height;

    let halfW = w/2;
    let halfH = h/2;
    let outerRadius = Math.sqrt(halfW * halfW + halfH * halfH);

    let radiusDuration = (1000 * Math.sqrt(outerRadius / RippleActivator.TOUCH_DOWN_ACCEL) + 0.5);
    let outerDuration = 1000 * (1/RippleActivator.OUTER_OPACITY_VEL);

    //console.log('Rippling', radiusDuration);

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
    ripple.outerRadius = outerRadius;
    ripple.radiusDuration = radiusDuration;

    // expand the circle from the users starting point
    // start slow, and when they let up, then speed up the animation
    ripple.expand = new Animation(rippleEle, {renderDelay: 0});
    ripple.expand
      .fromTo('scale', '0.001', '1')
      .duration(radiusDuration)
      .playbackRate(RippleActivator.DOWN_PLAYBACK_RATE)
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
      if(ripple.expand) {
        let currentTime = ripple.expand.getCurrentTime();

        // How much more time do we need to finish the radius animation?
        // Math: (radius/second) * ((total_radius_time) - current_time)
        let remainingTime = (ripple.outerRadius / ripple.radiusDuration) *
          ((ripple.radiusDuration / RippleActivator.DOWN_PLAYBACK_RATE)- (currentTime));
        ripple.expand.remainingTime = remainingTime;
      }

      if (!ripple.fade) {
        // ripple has not been let up yet
        // spped up the rate if the animation is still going
        setTimeout(() => {
          ripple.expand && ripple.expand.playbackRate(RippleActivator.EXPAND_OUT_PLAYBACK_RATE);
          ripple.fade = new Animation(ripple.ele);
          ripple.fade
            .fadeOut()
            .duration(ripple.epxand && ripple.expand.remaingTime || RippleActivator.OPACITY_OUT_DURATION)
            .playbackRate(RippleActivator.OPACITY_OUT_PLAYBACK_RATE)
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
        raf(() => {
          this.remove(rippleId);
        });
      }
    }
  }

  clearState() {
    this.deactivate();
    this.next(true);
  }

  remove(rippleId) {
    let ripple = this.ripples[rippleId];
    if (ripple) {
      ripple.expand && ripple.expand.dispose();
      ripple.fade && ripple.fade.dispose();
      removeElement(ripple.ele);
      ripple.ele = ripple.expand = ripple.fade = null;
      delete this.ripples[rippleId];
    }
  }

}


function isRippleElement(targetEle) {
  return (targetEle && targetEle.parentNode && !(NO_RIPPLE_TAGNAMES.test(targetEle.tagName)));
}

const NO_RIPPLE_TAGNAMES = /BACKDROP/;
