import {Activator} from './activator';
import {CSS, raf, rafFrames} from '../../util/dom';
const win: any = window;


/**
 * @private
 */
export class RippleActivator extends Activator {

  constructor(app, config, zone) {
    super(app, config, zone);
  }

  downAction(ev, activatableEle, pointerX, pointerY) {
    let self = this;
    if (self.disableActivated(ev)) {
      return;
    }

    // queue to have this element activated
    self._queue.push(activatableEle);

    this._zone.runOutsideAngular(function() {
      raf(function() {
        var i;

        for (i = 0; i < self._queue.length; i++) {
          var queuedEle = self._queue[i];
          if (queuedEle && queuedEle.parentNode) {
            self._active.push(queuedEle);

            // DOM WRITE
            queuedEle.classList.add(self._css);

            var j = queuedEle.childElementCount;
            while (j--) {
              var rippleEle: any = queuedEle.children[j];
              if (rippleEle.tagName === 'ION-BUTTON-EFFECT') {
                // DOM WRITE
                rippleEle.style.left = '-9999px';
                rippleEle.style.opacity = '';
                rippleEle.style[CSS.transform] = 'scale(0.001) translateZ(0px)';
                rippleEle.style[CSS.transition] = '';

                // DOM READ
                var clientRect = activatableEle.getBoundingClientRect();
                rippleEle.$top = clientRect.top;
                rippleEle.$left = clientRect.left;
                rippleEle.$width = clientRect.width;
                rippleEle.$height = clientRect.height;
                break;
              }
            }
          }
        }
        self._queue = [];
      });

    });
  }

  upAction(ev: UIEvent, activatableEle: HTMLElement, pointerX: number, pointerY: number) {
    let self = this;

    var i = activatableEle.childElementCount;
    while (i--) {
      var rippleEle: any = activatableEle.children[i];
      if (rippleEle.tagName === 'ION-BUTTON-EFFECT') {
        var clientPointerX = (pointerX - rippleEle.$left);
        var clientPointerY = (pointerY - rippleEle.$top);

        var x = Math.max(Math.abs(rippleEle.$width - clientPointerX), clientPointerX) * 2;
        var y = Math.max(Math.abs(rippleEle.$height - clientPointerY), clientPointerY) * 2;
        var diameter = Math.min(Math.max(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)), 64), 240);

        if (activatableEle.hasAttribute('ion-item')) {
          diameter = Math.min(diameter, 140);
        }

        var radius = Math.sqrt(rippleEle.$width + rippleEle.$height);

        var scaleTransitionDuration = Math.max(1600 * Math.sqrt(radius / TOUCH_DOWN_ACCEL) + 0.5, 260);
        var opacityTransitionDuration = scaleTransitionDuration * 0.7;
        var opacityTransitionDelay = scaleTransitionDuration - opacityTransitionDuration;

        // DOM WRITE
        rippleEle.style.width = rippleEle.style.height = diameter + 'px';
        rippleEle.style.marginTop = rippleEle.style.marginLeft = -(diameter / 2) + 'px';
        rippleEle.style.left = clientPointerX + 'px';
        rippleEle.style.top = clientPointerY + 'px';
        rippleEle.style.opacity = '0';
        rippleEle.style[CSS.transform] = 'scale(1) translateZ(0px)';
        rippleEle.style[CSS.transition] = 'transform ' +
                                          scaleTransitionDuration +
                                          'ms,opacity ' +
                                          opacityTransitionDuration +
                                          'ms ' +
                                          opacityTransitionDelay + 'ms';
      }
    }

    super.upAction(ev, activatableEle, pointerX, pointerY);
  }

  deactivate() {
    // remove the active class from all active elements
    let self = this;
    self._queue = [];

    rafFrames(2, function() {
      for (var i = 0; i < self._active.length; i++) {
        self._active[i].classList.remove(self._css);
      }
      self._active = [];
    });
  }

}

const TOUCH_DOWN_ACCEL = 300;

