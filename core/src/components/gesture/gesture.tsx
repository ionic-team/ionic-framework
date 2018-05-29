import { Component, EventListenerEnable, Listen, Prop, Watch } from '@stencil/core';
import { BlockerConfig, BlockerDelegate , GestureCallback, GestureDelegate, GestureDetail, QueueController } from '../../interface';
import { assert, now } from '../../utils/helpers';
import { PanRecognizer } from './recognizers';

export const BLOCK_ALL: BlockerConfig = {
  disable: ['menu-swipe', 'goback-swipe'],
  disableScroll: true
};

@Component({
  tag: 'ion-gesture'
})
export class Gesture {

  private detail: GestureDetail;
  private positions: number[] = [];
  private gesture?: GestureDelegate;
  private lastTouch = 0;
  private pan!: PanRecognizer;
  private hasCapturedPan = false;
  private hasStartedPan = false;
  private hasFiredStart = true;
  private isMoveQueued = false;
  private blocker?: BlockerDelegate;

  @Prop({ connect: 'ion-gesture-controller' }) gestureCtrl!: HTMLIonGestureControllerElement;
  @Prop({ context: 'queue' }) queue!: QueueController;
  @Prop({ context: 'enableListener' }) enableListener!: EventListenerEnable;
  @Prop({ context: 'isServer' }) isServer!: boolean;

  @Prop() disabled = false;
  @Prop() attachTo: string | HTMLElement = 'child';
  @Prop() autoBlockAll = false;
  @Prop() disableScroll = false;
  @Prop() direction = 'x';
  @Prop() gestureName = '';
  @Prop() gesturePriority = 0;
  @Prop() passive = true;
  @Prop() maxAngle = 40;
  @Prop() threshold = 10;

  @Prop() canStart?: GestureCallback;
  @Prop() onWillStart?: (_: GestureDetail) => Promise<void>;
  @Prop() onStart?: GestureCallback;
  @Prop() onMove?: GestureCallback;
  @Prop() onEnd?: GestureCallback;
  @Prop() notCaptured?: GestureCallback;

  constructor() {
    this.detail = {
      type: 'pan',
      startX: 0,
      startY: 0,
      startTimeStamp: 0,
      currentX: 0,
      currentY: 0,
      velocityX: 0,
      velocityY: 0,
      deltaX: 0,
      deltaY: 0,
      timeStamp: 0,
      event: undefined as any,
      data: undefined,
    };
  }

  async componentWillLoad() {
    if (this.isServer) {
      return;
    }
    this.gesture = await this.gestureCtrl.create({
      name: this.gestureName,
      priority: this.gesturePriority,
      disableScroll: this.disableScroll
    });
  }

  componentDidLoad() {
    if (this.isServer) {
      return;
    }
    // in this case, we already know the GestureController and Gesture are already
    // apart of the same bundle, so it's safe to load it this way
    // only create one instance of GestureController, and reuse the same one later
    this.pan = new PanRecognizer(this.direction, this.threshold, this.maxAngle);
    this.disabledChanged(this.disabled);

    if (this.autoBlockAll) {
      this.gestureCtrl.componentOnReady()
        .then(ctrl => ctrl.createBlocker(BLOCK_ALL))
        .then(blocker => this.blocker = blocker);
    }
  }

  componentDidUnload() {
    if (this.blocker) {
      this.blocker.destroy();
      this.blocker = undefined;
    }
    if (this.gesture) {
      this.gesture.destroy();
    }
  }

  @Watch('disabled')
  protected disabledChanged(isDisabled: boolean) {
    this.enableListener(this, 'touchstart', !isDisabled, this.attachTo, this.passive);
    this.enableListener(this, 'mousedown', !isDisabled, this.attachTo, this.passive);
    if (isDisabled) {
      this.abortGesture();
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
    assert(!this.hasCapturedPan, 'pan can be started at this point');
    assert(!this.isMoveQueued, 'some move is still queued');
    assert(this.positions.length === 0, 'positions must be emprty');

    // Check if gesture can start
    if (this.canStart && this.canStart(detail) === false) {
      return false;
    }
    // Release fallback
    this.gesture.release();

    // Start gesture
    if (!this.gesture.start()) {
      return false;
    }

    this.positions.push(detail.currentX, detail.currentY, timeStamp);
    this.hasStartedPan = true;
    if (this.threshold === 0) {
      return this.tryToCapturePan();
    }
    this.pan.start(detail.startX, detail.startY);
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
    // fast path, if gesture is currently captured
    // do minimun job to get user-land even dispatched
    if (this.hasCapturedPan) {
      if (!this.isMoveQueued && this.hasFiredStart) {
        this.isMoveQueued = true;
        this.calcGestureData(ev);
        this.queue.write(this.fireOnMove.bind(this));
      }
      return;
    }

    // gesture is currently being detected
    const detail = this.detail;
    this.calcGestureData(ev);
    if (this.pan.detect(detail.currentX, detail.currentY)) {
      if (this.pan.isGesture()) {
        if (!this.tryToCapturePan()) {
          this.abortGesture();
        }
      }
    }
  }

  private fireOnMove() {
    // Since fireOnMove is called inside a RAF, onEnd() might be called,
    // we must double check hasCapturedPan
    if (!this.hasCapturedPan) {
      return;
    }
    const detail = this.detail;
    this.isMoveQueued = false;
    if (this.onMove) {
      this.onMove(detail);
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
    while (startPos > 0 && positions[startPos] > timeRange) {
      startPos -= 3;
    }

    if (startPos > 1) {
      // compute relative movement between these two points
      const frequency = 1 / (positions[startPos] - timestamp);
      const movedY = positions[startPos - 1] - currentY;
      const movedX = positions[startPos - 2] - currentX;

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

  private tryToCapturePan(): boolean {
    if (this.gesture && !this.gesture.capture()) {
      return false;
    }
    this.hasCapturedPan = true;
    this.hasFiredStart = false;

    // reset start position since the real user-land event starts here
    // If the pan detector threshold is big, not reseting the start position
    // will cause a jump in the animation equal to the detector threshold.
    // the array of positions used to calculate the gesture velocity does not
    // need to be cleaned, more points in the positions array always results in a
    // more acurate value of the velocity.
    const detail = this.detail;
    detail.startX = detail.currentX;
    detail.startY = detail.currentY;
    detail.startTimeStamp = detail.timeStamp;

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
    }
    this.hasFiredStart = true;
  }

  private abortGesture() {
    this.reset();
    this.enable(false);
    if (this.notCaptured) {
      this.notCaptured(this.detail);
    }
  }

  private reset() {
    this.hasCapturedPan = false;
    this.hasStartedPan = false;
    this.isMoveQueued = false;
    this.hasFiredStart = true;
    if (this.gesture) {
      this.gesture.release();
    }
  }

  // END *************************

  @Listen('touchcancel', { passive: true, enabled: false })
  @Listen('touchend', { passive: true, enabled: false })
  onTouchCancel(ev: TouchEvent) {
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
      if (this.onEnd) {
        this.onEnd(detail);
      }
      return;
    }

    // Not captured any event
    if (this.notCaptured) {
      this.notCaptured(detail);
    }
  }

  // ENABLE LISTENERS *************************

  private enableMouse(shouldEnable: boolean) {
    this.enableListener(this, 'document:mousemove', shouldEnable, undefined, this.passive);
    this.enableListener(this, 'document:mouseup', shouldEnable, undefined, this.passive);
  }

  private enableTouch(shouldEnable: boolean) {
    this.enableListener(this, 'touchmove', shouldEnable, this.attachTo, this.passive);
    this.enableListener(this, 'touchcancel', shouldEnable, this.attachTo, this.passive);
    this.enableListener(this, 'touchend', shouldEnable, this.attachTo, this.passive);
  }

  private enable(shouldEnable: boolean) {
    this.enableMouse(shouldEnable);
    this.enableTouch(shouldEnable);
  }
}

const MOUSE_WAIT = 2500;

function updateDetail(ev: any, detail: GestureDetail) {
  // get X coordinates for either a mouse click
  // or a touch depending on the given event
  let x = 0;
  let y = 0;
  if (ev) {
    const changedTouches = ev.changedTouches;
    if (changedTouches && changedTouches.length > 0) {
      const touch = changedTouches[0];
      x = touch.clientX;
      y = touch.clientY;
    } else if (ev.pageX !== undefined) {
      x = ev.pageX;
      y = ev.pageY;
    }
  }
  detail.currentX = x;
  detail.currentY = y;
}
