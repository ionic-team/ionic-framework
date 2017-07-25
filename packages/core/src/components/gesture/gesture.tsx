import { applyStyles, getElementReference, pointerCoordX, pointerCoordY } from '../../utils/helpers';
import { BlockerDelegate } from './gesture-controller';
import { Component, Element, Event, EventEmitter, Listen, Prop, PropDidChange } from '@stencil/core';
import { GestureController, GestureDelegate, BLOCK_ALL } from './gesture-controller';
import { PanRecognizer } from './recognizers';


@Component({
  tag: 'ion-gesture'
})
export class Gesture {
  @Element() private el: HTMLElement;
  private ctrl: GestureController;
  private detail: GestureDetail = {};
  private positions: number[] = [];
  private gesture: GestureDelegate;
  private lastTouch = 0;
  private pan: PanRecognizer;
  private hasCapturedPan = false;
  private hasPress = false;
  private hasStartedPan = false;
  private requiresMove = false;
  private isMoveQueued = false;
  private blocker: BlockerDelegate;

  @Event() private ionGestureMove: EventEmitter;
  @Event() private ionGestureStart: EventEmitter;
  @Event() private ionGestureEnd: EventEmitter;
  @Event() private ionGestureNotCaptured: EventEmitter;
  @Event() private ionPress: EventEmitter;

  @Prop() attachTo: string = 'child';
  @Prop() autoBlockAll: boolean = false;
  @Prop() block: string = null;
  @Prop() disableScroll: boolean = false;
  @Prop() direction: string = 'x';
  @Prop() gestureName: string = '';
  @Prop() gesturePriority: number = 0;
  @Prop() maxAngle: number = 40;
  @Prop() threshold: number = 20;
  @Prop() type: string = 'pan';

  @Prop() canStart: GestureCallback;
  @Prop() onStart: GestureCallback;
  @Prop() onMove: GestureCallback;
  @Prop() onEnd: GestureCallback;
  @Prop() onPress: GestureCallback;
  @Prop() notCaptured: GestureCallback;


  ionViewDidLoad() {
    this.ctrl = Ionic.controllers.gesture = (Ionic.controllers.gesture || new GestureController());

    this.gesture = this.ctrl.createGesture(this.gestureName, this.gesturePriority, this.disableScroll);

    const types = this.type.replace(/\s/g, '').toLowerCase().split(',');

    if (types.indexOf('pan') > -1) {
      this.pan = new PanRecognizer(this.direction, this.threshold, this.maxAngle);
      this.requiresMove = true;
    }
    this.hasPress = (types.indexOf('press') > -1);

    if (this.pan || this.hasPress) {
      Core.enableListener(this, 'touchstart', true, this.attachTo);
      Core.enableListener(this, 'mousedown', true, this.attachTo);

      Core.dom.write(() => {
        applyStyles(getElementReference(this.el, this.attachTo), GESTURE_INLINE_STYLES);
      });
    }

    if (this.autoBlockAll) {
      this.blocker = this.ctrl.createBlocker(BLOCK_ALL);
      this.blocker.block();
    }
  }


  @PropDidChange('block')
  blockChange(block: string) {
    if (this.blocker) {
      this.blocker.destroy();
    }
    if (block) {
      this.blocker = this.ctrl.createBlocker({ disable: block.split(',')});
    }
  }

  // DOWN *************************

  @Listen('touchstart', { passive: true, enabled: false })
  onTouchStart(ev: TouchEvent) {
    this.lastTouch = now(ev);

    this.enableMouse(false);
    this.enableTouch(true);

    this.pointerDown(ev, this.lastTouch);
  }


  @Listen('mousedown', { passive: true, enabled: false })
  onMouseDown(ev: MouseEvent) {
    const timeStamp = now(ev);

    if (this.lastTouch === 0 || (this.lastTouch + MOUSE_WAIT < timeStamp)) {
      this.enableMouse(true);
      this.enableTouch(false);

      this.pointerDown(ev, timeStamp);
    }
  }


  private pointerDown(ev: UIEvent, timeStamp: number): boolean {
    if (!this.gesture || this.hasStartedPan) {
      return false;
    }

    const detail = this.detail;

    detail.startX = detail.currentX = pointerCoordX(ev);
    detail.startY = detail.currentY = pointerCoordY(ev);
    detail.startTimeStamp = detail.timeStamp = timeStamp;
    detail.velocityX = detail.velocityY = detail.deltaX = detail.deltaY = 0;
    detail.directionX = detail.directionY = detail.velocityDirectionX = detail.velocityDirectionY = null;
    detail.event = ev;
    this.positions.length = 0;

    if (this.canStart && this.canStart(detail) === false) {
      return false;
    }

    this.positions.push(detail.currentX, detail.currentY, timeStamp);

    // Release fallback
    this.gesture.release();

    // Start gesture
    if (!this.gesture.start()) {
      return false;
    }

    if (this.pan) {
      this.hasStartedPan = true;
      this.hasCapturedPan = false;

      this.pan.start(detail.startX, detail.startY);
    }

    return true;
  }


  // MOVE *************************

  @Listen('touchmove', { passive: true, enabled: false })
  onTouchMove(ev: TouchEvent) {
    this.lastTouch = this.detail.timeStamp = now(ev);

    this.pointerMove(ev);
  }


  @Listen('document:mousemove', { passive: true, enabled: false })
  onMoveMove(ev: TouchEvent) {
    const timeStamp = now(ev);

    if (this.lastTouch === 0 || (this.lastTouch + MOUSE_WAIT < timeStamp)) {
      this.detail.timeStamp = timeStamp;
      this.pointerMove(ev);
    }
  }

  private pointerMove(ev: UIEvent) {
    const detail = this.detail;
    this.calcGestureData(ev);

    if (this.pan) {
      if (this.hasCapturedPan) {

        if (!this.isMoveQueued) {
          this.isMoveQueued = true;

          Core.dom.write(() => {
            this.isMoveQueued = false;
            detail.type = 'pan';

            if (this.onMove) {
              this.onMove(detail);
            } else {
              this.ionGestureMove.emit(this.detail);
            }
          });
        }

      } else if (this.pan.detect(detail.currentX, detail.currentY)) {
        if (this.pan.isGesture() !== 0) {
          if (!this.tryToCapturePan(ev)) {
            this.abortGesture();
          }
        }
      }
    }
  }

  private calcGestureData(ev: UIEvent) {
    const detail = this.detail;
    detail.currentX = pointerCoordX(ev);
    detail.currentY = pointerCoordY(ev);
    detail.deltaX = (detail.currentX - detail.startX);
    detail.deltaY = (detail.currentY - detail.startY);
    detail.event = ev;

    // figure out which direction we're movin'
    detail.directionX = detail.velocityDirectionX = (detail.deltaX > 0 ? 'left' : (detail.deltaX < 0 ? 'right' : null));
    detail.directionY = detail.velocityDirectionY = (detail.deltaY > 0 ? 'up' : (detail.deltaY < 0 ? 'down' : null));

    const positions = this.positions;
    positions.push(detail.currentX, detail.currentY, detail.timeStamp);

    var endPos = (positions.length - 1);
    var startPos = endPos;
    var timeRange = (detail.timeStamp - 100);

    // move pointer to position measured 100ms ago
    for (var i = endPos; i > 0 && positions[i] > timeRange; i -= 3) {
      startPos = i;
    }

    if (startPos !== endPos) {
      // compute relative movement between these two points
      var movedX = (positions[startPos - 2] - positions[endPos - 2]);
      var movedY = (positions[startPos - 1] - positions[endPos - 1]);
      var factor = 16.67 / (positions[endPos] - positions[startPos]);

      // based on XXms compute the movement to apply for each render step
      detail.velocityX = movedX * factor;
      detail.velocityY = movedY * factor;

      detail.velocityDirectionX = (movedX > 0 ? 'left' : (movedX < 0 ? 'right' : null));
      detail.velocityDirectionY = (movedY > 0 ? 'up' : (movedY < 0 ? 'down' : null));
    }
  }

  private tryToCapturePan(ev: UIEvent): boolean {
    if (this.gesture && !this.gesture.capture()) {
      return false;
    }

    this.detail.event = ev;

    if (this.onStart) {
      this.onStart(this.detail);
    } else {
      this.ionGestureStart.emit(this.detail);
    }

    this.hasCapturedPan = true;

    return true;
  }

  private abortGesture() {
    this.hasStartedPan = false;
    this.hasCapturedPan = false;

    this.gesture && this.gesture.release();

    this.enable(false);
    this.notCaptured && this.notCaptured(this.detail);
  }


  // END *************************

  @Listen('touchend', { passive: true, enabled: false })
  onTouchEnd(ev: TouchEvent) {
    this.lastTouch = this.detail.timeStamp = now(ev);

    this.pointerUp(ev);
    this.enableTouch(false);
  }


  @Listen('document:mouseup', { passive: true, enabled: false })
  onMouseUp(ev: TouchEvent) {
    const timeStamp = now(ev);

    if (this.lastTouch === 0 || (this.lastTouch + MOUSE_WAIT < timeStamp)) {
      this.detail.timeStamp = timeStamp;
      this.pointerUp(ev);
      this.enableMouse(false);
    }
  }


  private pointerUp(ev: UIEvent) {
    const detail = this.detail;

    this.gesture && this.gesture.release();

    detail.event = ev;

    this.calcGestureData(ev);

    if (this.pan) {
      if (this.hasCapturedPan) {
        detail.type = 'pan';
        if (this.onEnd) {
          this.onEnd(detail);
        } else {
          this.ionGestureEnd.emit(detail);
        }

      } else if (this.hasPress) {
        this.detectPress();

      } else {
        if (this.notCaptured) {
          this.notCaptured(detail);
        } else {
          this.ionGestureNotCaptured.emit(detail);
        }
      }

    } else if (this.hasPress) {
      this.detectPress();
    }

    this.hasCapturedPan = false;
    this.hasStartedPan = false;
  }


  private detectPress() {
    const detail = this.detail;

    if (Math.abs(detail.startX - detail.currentX) < 10 && Math.abs(detail.startY - detail.currentY) < 10) {
      detail.type = 'press';

      if (this.onPress) {
        this.onPress(detail);
      } else {
        this.ionPress.emit(detail);
      }
    }
  }


  // ENABLE LISTENERS *************************

  private enableMouse(shouldEnable: boolean) {
    if (this.requiresMove) {
      Core.enableListener(this, 'document:mousemove', shouldEnable);
    }
    Core.enableListener(this, 'document:mouseup', shouldEnable);
  }


  private enableTouch(shouldEnable: boolean) {
    if (this.requiresMove) {
      Core.enableListener(this, 'touchmove', shouldEnable);
    }
    Core.enableListener(this, 'touchend', shouldEnable);
  }


  private enable(shouldEnable: boolean) {
    this.enableMouse(shouldEnable);
    this.enableTouch(shouldEnable);
  }


  ionViewDidUnload() {
    if (this.blocker) {
      this.blocker.destroy();
      this.blocker = null;
    }
    this.gesture && this.gesture.destroy();
    this.ctrl = this.gesture = this.pan = this.detail = this.detail.event = null;
  }

}


const GESTURE_INLINE_STYLES = {
  'touch-action': 'none',
  'user-select': 'none',
  '-webkit-user-drag': 'none',
  '-webkit-tap-highlight-color': 'rgba(0,0,0,0)'
};

const MOUSE_WAIT = 2500;


function now(ev: UIEvent) {
  return ev.timeStamp || Date.now();
}


export interface GestureDetail {
  type?: string;
  event?: UIEvent;
  startX?: number;
  startY?: number;
  startTimeStamp?: number;
  currentX?: number;
  currentY?: number;
  velocityX?: number;
  velocityY?: number;
  deltaX?: number;
  deltaY?: number;
  directionX?: 'left'|'right';
  directionY?: 'up'|'down';
  velocityDirectionX?: 'left'|'right';
  velocityDirectionY?: 'up'|'down';
  timeStamp?: number;
}


export interface GestureCallback {
  (detail?: GestureDetail): boolean|void;
}
