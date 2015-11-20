import {Activator} from './activator';
import {Animation} from '../../animations/animation';
import {raf, rafFrames} from '../../util/dom';


export class RippleActivator extends Activator {

  constructor(app, config) {
    super(app, config);

    this.expands = {};
    this.fades = {};
    this.expandSpeed = null;
  }

  downAction(ev, activatableEle, pointerX, pointerY) {
    if (super.downAction(ev, activatableEle, pointerX, pointerY) ) {
      // create a new ripple element
      this.expandSpeed = EXPAND_DOWN_PLAYBACK_RATE;

      rafFrames(2, () => {
        let clientRect = activatableEle.getBoundingClientRect();

        raf(() => {
          this.createRipple(activatableEle, pointerX, pointerY, clientRect);
        });
      });
    }
  }

  createRipple(activatableEle, pointerX, pointerY, clientRect) {
    let clientPointerX = (pointerX - clientRect.left);
    let clientPointerY = (pointerY - clientRect.top);

    let x = Math.max(Math.abs(clientRect.width - clientPointerX), clientPointerX) * 2;
    let y = Math.max(Math.abs(clientRect.height - clientPointerY), clientPointerY) * 2;
    let diameter = Math.max(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)), 64);

    let radius = Math.sqrt(clientRect.width + clientRect.height);
    let duration = (1000 * Math.sqrt(radius / TOUCH_DOWN_ACCEL) + 0.5);

    let rippleEle = document.createElement('md-ripple');
    let rippleId = Date.now();
    let eleStyle = rippleEle.style;
    eleStyle.width = eleStyle.height = diameter + 'px';
    eleStyle.marginTop = eleStyle.marginLeft = -(diameter / 2) + 'px';
    eleStyle.left = clientPointerX + 'px';
    eleStyle.top = clientPointerY + 'px';

    activatableEle.appendChild(rippleEle);

    // create the animation for the fade out, but don't start it yet
    this.fades[rippleId] = new Animation(rippleEle, {renderDelay: 0});
    this.fades[rippleId]
      .fadeOut()
      .duration(FADE_OUT_DURATION)
      .playbackRate(1)
      .onFinish(() => {
        raf(() => {
          this.fades[rippleId].dispose(true);
          delete this.fades[rippleId];
        });
      });

    // expand the circle from the users starting point
    // start slow, and when they let up, then speed up the animation
    this.expands[rippleId] = new Animation(rippleEle, {renderDelay: 0});
    this.expands[rippleId]
      .fromTo('scale', '0.001', '1')
      .duration(duration)
      .playbackRate(this.expandSpeed)
      .onFinish(()=> {
        this.expands[rippleId].dispose();
        delete this.expands[rippleId];

        this.next();
      })
      .play();
  }

  upAction() {
    this.deactivate();

    this.expandSpeed = 1;

    rafFrames(4, () => {
      this.next();
    });
  }

  next() {
    const now = Date.now();

    let rippleId;
    for (rippleId in this.expands) {
      if (parseInt(rippleId, 10) + 4000 < now) {
        this.expands[rippleId].dispose(true);
        delete this.expands[rippleId];

      } else if (this.expands[rippleId].playbackRate() === EXPAND_DOWN_PLAYBACK_RATE) {
        this.expands[rippleId].playbackRate(EXPAND_OUT_PLAYBACK_RATE);
      }
    }

    for (rippleId in this.fades) {
      if (parseInt(rippleId, 10) + 4000 < now) {
        this.fades[rippleId].dispose(true);
        delete this.fades[rippleId];

      } else if (!this.fades[rippleId].isPlaying) {
        this.fades[rippleId].isPlaying = true;
        this.fades[rippleId].play();
      }
    }
  }

  clearState() {
    this.deactivate();
    this.next();
  }

}

const TOUCH_DOWN_ACCEL = 512;
const EXPAND_DOWN_PLAYBACK_RATE = 0.35;
const EXPAND_OUT_PLAYBACK_RATE = 3;
const FADE_OUT_DURATION = 700;
