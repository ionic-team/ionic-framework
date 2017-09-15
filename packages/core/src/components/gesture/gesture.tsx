import { applyStyles, getElementReference, ElementRef, updateDetail, assert } from '../../utils/helpers';
import { BlockerDelegate, GestureController, GestureDelegate, BLOCK_ALL } from '../gesture-controller/gesture-controller';
import { Component, Element, Event, EventEmitter, Listen, Prop, PropDidChange } from '@stencil/core';
import { PanRecognizer } from './recognizers';

@Component({
  tag: 'ion-gesture'
})
export class Gesture {

  @Element() private el: HTMLElement;
  private detail: GestureDetail = {};
  private positions: number[] = [];
  private ctrl: GestureController;
  private gesture: GestureDelegate;
  private lastTouch = 0;
  private pan: PanRecognizer;
  private hasCapturedPan = false;
  private hasPress = false;
  private hasStartedPan = false;
  private hasFiredStart = true;
  private isMoveQueued = false;
  private blocker: BlockerDelegate;
  private fireOnMoveFunc: any;

  @Event() private ionGestureMove: EventEmitter;
  @Event() private ionGestureStart: EventEmitter;
  @Event() private ionGestureEnd: EventEmitter;
  @Event() private ionGestureNotCaptured: EventEmitter;
  @Event() private ionPress: EventEmitter;

  @Prop() enabled: boolean = true;
  @Prop() attachTo: ElementRef = 'child';
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
  @Prop() onWillStart: (_: GestureDetail) => Promise<void>;
  @Prop() onStart: GestureCallback;
  @Prop() onMove: GestureCallback;
  @Prop() onEnd: GestureCallback;
  @Prop() onPress: GestureCallback;
  @Prop() notCaptured: GestureCallback;

  constructor() {
    this.fireOnMoveFunc = this.fireOnMove.bind(this);
  }

  ionViewDidLoad() {
    // in this case, we already know the GestureController and Gesture are already
    // apart of the same bundle, so it's safe to load it this way
    // only create one instance of GestureController, and reuse the same one later
    this.ctrl = Context.gesture = Context.gesture || new GestureController;
    this.gesture = this.ctrl.createGesture(this.gestureName, this.gesturePriority, this.disableScroll);

    const types = this.type.replace(/\s/g, '').toLowerCase().split(',');
    if (types.indexOf('pan') > -1) {
      this.pan = new PanRecognizer(this.direction, this.threshold, this.maxAngle);
    }
    this.hasPress = (types.indexOf('press') > -1);

    this.enabledChange(true);
    if (this.pan || this.hasPress) {
      Context.dom.write(() => {
        applyStyles(getElementReference(this.el, this.attachTo), GESTURE_INLINE_STYLES);
      });
    }

    if (this.autoBlockAll) {
      this.blocker = this.ctrl.createBlocker(BLOCK_ALL);
      this.blocker.block();
    }
  }

  @PropDidChange('enabled')
  enabledChange(isEnabled: boolean) {
    if (!this.gesture) {
      return;
    }
    if (this.pan || this.hasPress) {
      Context.enableListener(this, 'touchstart', isEnabled, this.attachTo);
      Context.enableListener(this, 'mousedown', isEnabled, this.attachTo);
      if (!isEnabled) {
        this.abortGesture();
      }
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

    if (this.pointerDown(ev, this.lastTouch)) {
      this.enableMouse(false);
      this.enableTouch(true);
    } else {
      this.abortGesture();
    }
  }


  @Listen('mousedown', { passive: true, enabled: false })
  onMouseDown(ev: MouseEvent) {
    const timeStamp = now(ev);

    if (this.lastTouch === 0 || (this.lastTouch + MOUSE_WAIT < timeStamp)) {
      if (this.pointerDown(ev, timeStamp)) {
        this.enableMouse(true);
        this.enableTouch(false);
      } else {
        this.abortGesture();
      }
    }
  }

  private pointerDown(ev: UIEvent, timeStamp: number): boolean {
    if (!this.gesture || this.hasStartedPan || !this.hasFiredStart) {
      return false;
    }
    const detail = this.detail;

    updateDetail(ev, detail);
    detail.startX = detail.currentX;
    detail.startY = detail.currentY;
    detail.startTimeStamp = detail.timeStamp = timeStamp;
    detail.velocityX = detail.velocityY = detail.deltaX = detail.deltaY = 0;
    detail.event = ev;
    this.positions.length = 0;

    assert(this.hasFiredStart, 'fired start must be false');
    assert(!this.hasStartedPan, 'pan can be started at this point');
    assert(!this.hasCapturedPan, 'pan can be started at this point')
    assert(!this.isMoveQueued, 'some move is still queued');
    assert(this.positions.length === 0, 'positions must be emprty');

    // Check if gesture can start
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
    assert(!!this.pan, 'pan must be non null');

    if (this.hasCapturedPan) {
      if (!this.isMoveQueued && this.hasFiredStart) {
        this.isMoveQueued = true;
        this.calcGestureData(ev);
        Context.dom.write(this.fireOnMoveFunc);
      }
      return;
    }

    const detail = this.detail;
    this.calcGestureData(ev);
    if (this.pan.detect(detail.currentX, detail.currentY)) {
      if (this.pan.isGesture() !== 0) {
        if (!this.tryToCapturePan(ev)) {
          this.abortGesture();
        }
      }
    }
  }

  private fireOnMove() {
    const detail = this.detail;
    this.isMoveQueued = false;
    if (this.onMove) {
      this.onMove(detail);
    } else {
      this.ionGestureMove.emit(detail);
    }
  }

  private calcGestureData(ev: UIEvent) {
    const detail = this.detail;
    updateDetail(ev, detail);

    const currentX = detail.currentX;
    const currentY = detail.currentY;
    const timestamp = detail.timeStamp;
    detail.deltaX = currentX - detail.startX;
    detail.deltaY = currentY - detail.startY;
    detail.event = ev;

    const timeRange = timestamp - 100;
    const positions = this.positions;
    let startPos = positions.length - 1;

    // move pointer to position measured 100ms ago
    for (;
      startPos > 0 && positions[startPos] > timeRange;
      startPos -= 3) { }

    if (startPos > 1) {
      // compute relative movement between these two points
      var frequency = 1 / (positions[startPos] - timestamp);
      var movedY = positions[startPos - 1] - currentY;
      var movedX = positions[startPos - 2] - currentX;

      // based on XXms compute the movement to apply for each render step
      // velocity = space/time = s*(1/t) = s*frequency
      detail.velocityX = movedX * frequency;
      detail.velocityY = movedY * frequency;
    } else {
      detail.velocityX = 0;
      detail.velocityY = 0;
    }
    positions.push(currentX, currentY, timestamp);
  }

  private tryToCapturePan(ev: UIEvent): boolean {
    if (this.gesture && !this.gesture.capture()) {
      return false;
    }
    this.hasCapturedPan = true;
    this.hasFiredStart = false;
    this.calcGestureData(ev);
    if (this.onWillStart) {
      this.onWillStart(this.detail).then(this.fireOnStart.bind(this));
    } else {
      this.fireOnStart();
    }
    return true;
  }

  private fireOnStart() {
    assert(!this.hasFiredStart, 'has fired must be false');
    if (this.onStart) {
      this.onStart(this.detail);
    } else {
      this.ionGestureStart.emit(this.detail);
    }
    this.hasFiredStart = true;
  }

  private abortGesture() {
    this.reset();
    this.enable(false);
    this.notCaptured && this.notCaptured(this.detail);
  }

  private reset() {
    this.hasCapturedPan = false;
    this.hasStartedPan = false;
    this.hasFiredStart = true;
    this.gesture && this.gesture.release();
  }

  // END *************************

  @Listen('touchcancel', { passive: true, enabled: false })
  onTouchCancel(ev: TouchEvent) {
    this.lastTouch = this.detail.timeStamp = now(ev);

    this.pointerUp(ev);
    this.enableTouch(false);
  }


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
    const hasCaptured = this.hasCapturedPan;
    const hasFiredStart = this.hasFiredStart;
    this.reset();

    if (!hasFiredStart) {
      return;
    }
    const detail = this.detail;
    this.calcGestureData(ev);

    // Try to capture press
    if (hasCaptured) {
      detail.type = 'pan';
      if (this.onEnd) {
        this.onEnd(detail);
      } else {
        this.ionGestureEnd.emit(detail);
      }
      return;
    }

    // Try to capture press
    if (this.hasPress && this.detectPress()) {
      return;
    }

    // Not captured any event
    if (this.notCaptured) {
      this.notCaptured(detail);
    } else {
      this.ionGestureNotCaptured.emit(detail);
    }
  }

  private detectPress(): boolean {
    const detail = this.detail;
    const vecX = detail.deltaX;
    const vecY = detail.deltaY;
    const dis = vecX * vecX + vecY * vecY;
    if (dis < 100) {
      detail.type = 'press';

      if (this.onPress) {
        this.onPress(detail);
      } else {
        this.ionPress.emit(detail);
      }
      return true;
    }
    return false;
  }

  // ENABLE LISTENERS *************************

  private enableMouse(shouldEnable: boolean) {
    if (this.pan) {
      Context.enableListener(this, 'document:mousemove', shouldEnable, this.attachTo);
    }
    Context.enableListener(this, 'document:mouseup', shouldEnable, this.attachTo);
  }


  private enableTouch(shouldEnable: boolean) {
    if (this.pan) {
      Context.enableListener(this, 'touchmove', shouldEnable, this.attachTo);
    }
    Context.enableListener(this, 'touchcancel', shouldEnable, this.attachTo);
    Context.enableListener(this, 'touchend', shouldEnable, this.attachTo);
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
  timeStamp?: number;
}


export interface GestureCallback {
  (detail?: GestureDetail): boolean|void;
}
