import { Component, Event, EventEmitter, Method } from '@stencil/core';
import { BlockerConfig, BlockerDelegate, GestureConfig, GestureDelegate } from './gesture-controller-utils';


@Component({
  tag: 'ion-gesture-controller'
})
export class GestureController {

  private gestureId = 0;
  private requestedStart = new Map<number, number>();
  private disabledGestures = new Map<string, Set<number>>();
  private disabledScroll = new Set<number>();
  private capturedId: number|null = null;

  @Event() ionGestureCaptured!: EventEmitter<string>;

  @Method()
  create(config: GestureConfig): Promise<GestureDelegate> {
    return Promise.resolve(new GestureDelegate(
      this, this.newID(),
      config.name,
      config.priority ? config.priority : 0,
      !!config.disableScroll));
  }

  @Method()
  createBlocker(opts: BlockerConfig = {}): BlockerDelegate {
    return new BlockerDelegate(this.newID(), this,
      opts.disable,
      !!opts.disableScroll
    );
  }

  start(gestureName: string, id: number, priority: number): boolean {
    if (!this.canStart(gestureName)) {
      this.requestedStart.delete(id);
      return false;
    }
    this.requestedStart.set(id, priority);
    return true;
  }

  capture(gestureName: string, id: number, priority: number): boolean {
    if (!this.start(gestureName, id, priority)) {
      return false;
    }
    const requestedStart = this.requestedStart;
    let maxPriority = -10000;

    requestedStart.forEach(value => {
      maxPriority = Math.max(maxPriority, value);
    });

    if (maxPriority === priority) {
      this.capturedId = id;
      requestedStart.clear();
      this.ionGestureCaptured && this.ionGestureCaptured.emit(gestureName);
      return true;
    }
    requestedStart.delete(id);

    return false;
  }

  release(id: number) {
    this.requestedStart.delete(id);

    if (this.capturedId && id === this.capturedId) {
      this.capturedId = null;
    }
  }

  disableGesture(gestureName: string, id: number) {
    let set = this.disabledGestures.get(gestureName);
    if (!set) {
      set = new Set<number>();
      this.disabledGestures.set(gestureName, set);
    }
    set.add(id);
  }

  enableGesture(gestureName: string, id: number) {
    const set = this.disabledGestures.get(gestureName);
    if (set) {
      set.delete(id);
    }
  }

  disableScroll(id: number) {
    this.disabledScroll.add(id);
  }

  enableScroll(id: number) {
    this.disabledScroll.delete(id);
  }

  canStart(gestureName: string): boolean {
    if (this.capturedId) {
      // a gesture already captured
      return false;
    }

    if (this.isDisabled(gestureName)) {
      return false;
    }

    return true;
  }

  isCaptured(): boolean {
    return !!this.capturedId;
  }

  isScrollDisabled(): boolean {
    return this.disabledScroll.size > 0;
  }

  isDisabled(gestureName: string): boolean {
    const disabled = this.disabledGestures.get(gestureName);
    if (disabled && disabled.size > 0) {
      return true;
    }
    return false;
  }

  private newID(): number {
    this.gestureId++;
    return this.gestureId;
  }
}
