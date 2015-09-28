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
    let r = activatableEle.getBoundingClientRect();

    let outerRadius = Math.sqrt(r.width + r.height);
    let radiusDuration = (1000 * Math.sqrt(outerRadius / TOUCH_DOWN_ACCEL) + 0.5);

    let x = Math.max(Math.abs(r.width - pointerX), pointerX) * 2;
    let y = Math.max(Math.abs(r.height - pointerY), pointerY) * 2;
    let size = (Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))) - 10;

    let rippleEle = document.createElement('md-ripple');
    let eleStyle = rippleEle.style;
    eleStyle.width = eleStyle.height = size + 'px';
    eleStyle.marginTop = eleStyle.marginLeft = -(size / 2) + 'px';
    eleStyle.left = (pointerX - r.left) + 'px';
    eleStyle.top = (pointerY - r.top) + 'px';

    activatableEle.appendChild(rippleEle);

    let ripple = this.ripples[Date.now()] = {
      ele: rippleEle,
      outerRadius: outerRadius,
      radiusDuration: radiusDuration
    };

    //console.log('outerRadius', outerRadius, 'radiusDuration', radiusDuration, 'size', size)

    // expand the circle from the users starting point
    // start slow, and when they let up, then speed up the animation
    ripple.expand = new Animation(rippleEle, {renderDelay: 0});
    ripple.expand
      .fromTo('scale', '0.001', '1')
      .duration(radiusDuration)
      .playbackRate(DOWN_PLAYBACK_RATE)
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
        ripple.expand.remainingTime = (ripple.outerRadius / ripple.radiusDuration) *
          ((ripple.radiusDuration / DOWN_PLAYBACK_RATE) - (currentTime));
      }

      if (!ripple.fade) {
        // ripple has not been let up yet
        // speed up the rate if the animation is still going
        setTimeout(() => {
          ripple.expand && ripple.expand.playbackRate(EXPAND_OUT_PLAYBACK_RATE);
          ripple.fade = new Animation(ripple.ele);
          ripple.fade
            .fadeOut()
            .duration(ripple.epxand && ripple.expand.remainingTime || OPACITY_OUT_DURATION)
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
const OPACITY_OUT_DURATION = 750;
const EXPAND_OUT_PLAYBACK_RATE = 2.5;
const DOWN_PLAYBACK_RATE = 0.45;
