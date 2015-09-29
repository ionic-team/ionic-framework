import {Activator} from './activator';
import {removeElement, raf} from '../../util/dom';
import {Animation} from '../../animations/animation';


export class RippleActivator extends Activator {

  constructor(app, config) {
    super(app, config);
    this.ripples = {};
  }

  downAction(ev, activatableEle, pointerX, pointerY) {

    if (this.disableActivated(ev)) return;

    super.downAction(ev, activatableEle, pointerX, pointerY);

    // create a new ripple element
    let clientRect = activatableEle.getBoundingClientRect();
    let clientPointerX = (pointerX - clientRect.left);
    let clientPointerY = (pointerY - clientRect.top);

    let x = Math.max(Math.abs(clientRect.width - clientPointerX), clientPointerX) * 2;
    let y = Math.max(Math.abs(clientRect.height - clientPointerY), clientPointerY) * 2;
    let diameter = Math.max(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)), 64);

    let radius = Math.sqrt(clientRect.width + clientRect.height);
    let duration = (1000 * Math.sqrt(radius / TOUCH_DOWN_ACCEL) + 0.5);

    let rippleEle = document.createElement('md-ripple');
    let eleStyle = rippleEle.style;
    eleStyle.width = eleStyle.height = diameter + 'px';
    eleStyle.marginTop = eleStyle.marginLeft = -(diameter / 2) + 'px';
    eleStyle.left = clientPointerX + 'px';
    eleStyle.top = clientPointerY + 'px';

    activatableEle.appendChild(rippleEle);

    let ripple = this.ripples[Date.now()] = {
      ele: rippleEle,
      radius: radius,
      duration: duration
    };

    // expand the circle from the users starting point
    // start slow, and when they let up, then speed up the animation
    ripple.expand = new Animation(rippleEle, {renderDelay: 0});
    ripple.expand
      .fromTo('scale', '0.001', '1')
      .duration(duration)
      .playbackRate(EXPAND_DOWN_PLAYBACK_RATE)
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

  upAction(forceFadeOut) {
    this.deactivate();

    let ripple;
    for (let rippleId in this.ripples) {
      ripple = this.ripples[rippleId];

      if (!ripple.fade || forceFadeOut) {
        // ripple has not been let up yet
        // speed up the rate if the animation is still going
        setTimeout(() => {
          ripple.expand && ripple.expand.playbackRate(EXPAND_OUT_PLAYBACK_RATE);
          ripple.fade = new Animation(ripple.ele);
          ripple.fade
            .fadeOut()
            .duration(OPACITY_OUT_DURATION)
            .playbackRate(1)
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
           forceComplete || parseInt(rippleId) + 5000 < Date.now()) {
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

const TOUCH_DOWN_ACCEL = 512;
const EXPAND_DOWN_PLAYBACK_RATE = 0.35;
const EXPAND_OUT_PLAYBACK_RATE = 3;
const OPACITY_OUT_DURATION = 750;
