import { QueueApi } from '@stencil/core';

import { PanRecognizer } from './recognizers';

import { GestureDelegate, gestureController } from './gesture-controller';
import { PointerEvents } from './pointer-events';

export interface GestureDetail {
  type: string;
  startX: number;
  startY: number;
  startTimeStamp: number;
  currentX: number;
  currentY: number;
  velocityX: number;
  velocityY: number;
  deltaX: number;
  deltaY: number;
  timeStamp: number;
  event: UIEvent;
  data?: any;
}

export type GestureCallback = (detail?: GestureDetail) => boolean | void;

export interface GestureConfig {
  el: Node;
  disableScroll?: boolean;

  queue: QueueApi;
  direction?: 'x' | 'y';
  gestureName: string;
  gesturePriority?: number;
  passive?: boolean;
  maxAngle?: number;
  threshold?: number;

  canStart?: GestureCallback;
  onWillStart?: (_: GestureDetail) => Promise<void>;
  onStart?: GestureCallback;
  onMove?: GestureCallback;
  onEnd?: GestureCallback;
  notCaptured?: GestureCallback;
}

export function create(config: GestureConfig) {
  return new Gesture(config);
}

export class Gesture {

  private detail: GestureDetail;
  private positions: number[] = [];
  private gesture: GestureDelegate;
  private pan: PanRecognizer;
  private hasCapturedPan = false;
  private hasStartedPan = false;
  private hasFiredStart = true;
  private isMoveQueued = false;
  private pointerEvents: PointerEvents;

  private canStart?: GestureCallback;
  private onWillStart?: (_: GestureDetail) => Promise<void>;
  private onStart?: GestureCallback;
  private onMove?: GestureCallback;
  private onEnd?: GestureCallback;
  private notCaptured?: GestureCallback;
  private threshold: number;
  private queue: QueueApi;

  constructor(config: GestureConfig) {
    const finalConfig = {
      disableScroll: false,
      direction: 'x',
      gesturePriority: 0,
      passive: true,
      maxAngle: 40,
      threshold: 10,

      ...config
    };

    this.canStart = finalConfig.canStart;
    this.onWillStart = finalConfig.onWillStart;
    this.onStart = finalConfig.onStart;
    this.onEnd = finalConfig.onEnd;
    this.onMove = finalConfig.onMove;
    this.threshold = finalConfig.threshold;
    this.queue = finalConfig.queue;

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
      data: undefined
    };

    this.pointerEvents = new PointerEvents(
      finalConfig.el,
      this.pointerDown.bind(this),
      this.pointerMove.bind(this),
      this.pointerUp.bind(this),
      {
        capture: false,
      }
    );

    this.pan = new PanRecognizer(finalConfig.direction, finalConfig.threshold, finalConfig.maxAngle);
    this.gesture = gestureController.createGesture({
      name: config.gestureName,
      priority: config.gesturePriority,
      disableScroll: config.disableScroll
    });
  }

  set disabled(disabled: boolean) {
    this.pointerEvents.disabled = disabled;
  }

  destroy() {
    this.gesture.destroy();
    this.pointerEvents.destroy();
  }

  private pointerDown(ev: UIEvent): boolean {
    const timeStamp = now(ev);
    if (this.hasStartedPan || !this.hasFiredStart) {
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
    const timestamp = detail.timeStamp = now(ev);
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
    if (this.onStart) {
      this.onStart(this.detail);
    }
    this.hasFiredStart = true;
  }

  private abortGesture() {
    this.reset();
    this.pointerEvents.stop();
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

  private pointerUp(ev: UIEvent) {
    const hasCaptured = this.hasCapturedPan;
    const hasFiredStart = this.hasFiredStart;
    this.reset();

    if (!hasFiredStart) {
      return;
    }
    this.calcGestureData(ev);

    const detail = this.detail;

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
}

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

function now(ev: UIEvent) {
  return ev.timeStamp || Date.now();
}
