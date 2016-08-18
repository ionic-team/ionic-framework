import { defaults } from '../util/util';
import { GestureDelegate } from '../gestures/gesture-controller';
import { PanRecognizer } from './recognizers';
import { PointerEvents, UIEventManager } from '../util/ui-event-manager';
import { pointerCoord } from '../util/dom';

/**
 * @private
 */
export interface PanGestureConfig {
  threshold?: number;
  maxAngle?: number;
  direction?: 'x' | 'y';
  gesture?: GestureDelegate;
}

/**
 * @private
 */
export class PanGesture {
  private events: UIEventManager = new UIEventManager(false);
  private pointerEvents: PointerEvents;
  private detector: PanRecognizer;
  private started: boolean = false;
  private captured: boolean = false;
  public isListening: boolean = false;
  protected gestute: GestureDelegate;
  protected direction: string;

  constructor(private element: HTMLElement, opts: PanGestureConfig = {}) {
    defaults(opts, {
      threshold: 20,
      maxAngle: 40,
      direction: 'x'
    });
    this.gestute = opts.gesture;
    this.direction = opts.direction;
    this.detector = new PanRecognizer(opts.direction, opts.threshold, opts.maxAngle);
  }

  listen() {
    if (!this.isListening) {
      this.pointerEvents = this.events.pointerEvents({
        element: this.element,
        pointerDown: this.pointerDown.bind(this),
        pointerMove: this.pointerMove.bind(this),
        pointerUp: this.pointerUp.bind(this),
      });
      this.isListening = true;
    }
  }

  unlisten() {
    this.gestute && this.gestute.release();
    this.events.unlistenAll();
    this.isListening = false;
  }

  destroy() {
    this.gestute && this.gestute.destroy();
    this.unlisten();
    this.element = null;
  }

  pointerDown(ev: any): boolean {
    if (this.started) {
      return;
    }
    if (!this.canStart(ev)) {
      return false;
    }
    if (this.gestute) {
      // Release fallback
      this.gestute.release();
      // Start gesture
      if (!this.gestute.start()) {
        return false;
      }
    }

    let coord = pointerCoord(ev);
    this.detector.start(coord);
    this.started = true;
    this.captured = false;
    return true;
  }

  pointerMove(ev: any) {
    if (!this.started) {
      return;
    }
    if (this.captured) {
      this.onDragMove(ev);
      return;
    }
    let coord = pointerCoord(ev);
    if (this.detector.detect(coord)) {

      if (this.detector.pan() !== 0 && this.canCapture(ev) &&
        (!this.gestute || this.gestute.capture())) {
        this.onDragStart(ev);
        this.captured = true;
        return;
      }

      // Detection/capturing was not successful, aborting!
      this.started = false;
      this.captured = false;
      this.pointerEvents.stop();
      this.notCaptured(ev);
    }
  }

  pointerUp(ev: any) {
    if (!this.started) {
      return;
    }
    this.gestute && this.gestute.release();

    if (this.captured) {
      this.onDragEnd(ev);
    } else {
      this.notCaptured(ev);
    }
    this.captured = false;
    this.started = false;
  }

  getNativeElement(): HTMLElement {
    return this.element;
  }

  // Implemented in a subclass
  canStart(ev: any): boolean { return true; }
  canCapture(ev: any): boolean { return true; }
  onDragStart(ev: any) { }
  onDragMove(ev: any) { }
  onDragEnd(ev: any) { }
  notCaptured(ev: any) { }
}
