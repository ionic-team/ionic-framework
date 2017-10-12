import { assert, defaults } from '../util/util';
import { DomController, DomDebouncer } from '../platform/dom-controller';
import { GestureDelegate } from './gesture-controller';
import { PanRecognizer } from './recognizers';
import { Platform } from '../platform/platform';
import { pointerCoord } from '../util/dom';
import { PointerEvents, PointerEventsConfig } from './pointer-events';
import { UIEventManager } from './ui-event-manager';


/**
 * @hidden
 */
export class PanGesture {
  private debouncer: DomDebouncer;
  private events: UIEventManager;
  private pointerEvents: PointerEvents;
  private detector: PanRecognizer;
  protected started: boolean;
  private captured: boolean;
  public isListening: boolean;
  protected gestute: GestureDelegate;
  protected direction: string;
  private eventsConfig: PointerEventsConfig;

  constructor(public plt: Platform, private element: HTMLElement, opts: PanGestureConfig = {}) {
    defaults(opts, {
      threshold: 20,
      maxAngle: 40,
      direction: 'x',
      zone: true,
      capture: false,
      passive: false,
    });
    this.events = new UIEventManager(plt);
    if (opts.domController) {
      this.debouncer = opts.domController.debouncer();
    }
    this.gestute = opts.gesture;
    this.direction = opts.direction;
    this.eventsConfig = {
      element: this.element,
      pointerDown: this.pointerDown.bind(this),
      pointerMove: this.pointerMove.bind(this),
      pointerUp: this.pointerUp.bind(this),
      zone: opts.zone,
      capture: opts.capture,
      passive: opts.passive
    };
    if (opts.threshold > 0) {
      this.detector = new PanRecognizer(opts.direction, opts.threshold, opts.maxAngle);
    }
  }

  listen() {
    if (!this.isListening) {
      this.pointerEvents = this.events.pointerEvents(this.eventsConfig);
      this.isListening = true;
    }
  }

  unlisten() {
    if (this.isListening) {
      this.gestute && this.gestute.release();
      this.events.unlistenAll();
      this.isListening = false;
    }
  }

  destroy() {
    this.gestute && this.gestute.destroy();
    this.gestute = null;
    this.unlisten();
    this.events.destroy();
    this.events = this.element = this.gestute = null;
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
    this.started = true;
    this.captured = false;

    const coord = pointerCoord(ev);
    if (this.detector) {
      this.detector.start(coord);

    } else {
      if (!this.tryToCapture(ev)) {
        this.started = false;
        this.captured = false;
        this.gestute.release();
        return false;
      }
    }
    return true;
  }

  pointerMove(ev: any) {
    assert(this.started === true, 'started must be true');
    if (this.captured) {
      this.debouncer.write(() => {
        this.onDragMove(ev);
      });
      return;
    }

    assert(this.detector, 'detector has to be valid');
    const coord = pointerCoord(ev);
    if (this.detector.detect(coord)) {
      if (this.detector.pan() !== 0) {
        if (!this.tryToCapture(ev)) {
          this.abort(ev);
        }
      }
    }
  }

  pointerUp(ev: any) {
    assert(this.started, 'started failed');
    this.debouncer.cancel();

    this.gestute && this.gestute.release();

    if (this.captured) {
      this.onDragEnd(ev);
    } else {
      this.notCaptured(ev);
    }
    this.captured = false;
    this.started = false;
  }

  tryToCapture(ev: any): boolean {
    assert(this.started === true, 'started has be true');
    assert(this.captured === false, 'captured has be false');

    if (this.gestute && !this.gestute.capture()) {
      return false;
    }
    this.onDragStart(ev);
    this.captured = true;
    return true;
  }

  abort(ev: any) {
    this.started = false;
    this.captured = false;
    this.gestute.release();
    this.pointerEvents.stop();
    this.notCaptured(ev);
  }

  getNativeElement(): HTMLElement {
    return this.element;
  }

  // Implemented in a subclass
  canStart(_ev: any): boolean { return true; }
  onDragStart(_ev: any) { }
  onDragMove(_ev: any) { }
  onDragEnd(_ev: any) { }
  notCaptured(_ev: any) { }
}


/**
 * @hidden
 */
export interface PanGestureConfig {
  threshold?: number;
  maxAngle?: number;
  direction?: 'x' | 'y';
  gesture?: GestureDelegate;
  domController?: DomController;
  zone?: boolean;
  capture?: boolean;
  passive?: boolean;
}
