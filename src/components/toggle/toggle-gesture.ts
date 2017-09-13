import { GESTURE_PRIORITY_TOGGLE, GESTURE_TOGGLE, GestureController } from '../../gestures/gesture-controller';
import { DomController } from '../../platform/dom-controller';
import { PanGesture } from '../../gestures/pan-gesture';
import { Platform } from '../../platform/platform';
import { pointerCoord } from '../../util/dom';
import { Toggle } from './toggle';

/**
 * @hidden
 */
export class ToggleGesture extends PanGesture {

  constructor(
    plt: Platform,
    public toggle: Toggle,
    gestureCtrl: GestureController,
    domCtrl: DomController
  ) {
    super(
      plt,
      toggle.getNativeElement(), {
      threshold: 0,
      zone: false,
      domController: domCtrl,
      gesture: gestureCtrl.createGesture({
        name: GESTURE_TOGGLE,
        priority: GESTURE_PRIORITY_TOGGLE
      })
    });
  }

  canStart(): boolean {
    return true;
  }

  onDragStart(ev: any) {
    ev.preventDefault();

    this.toggle._onDragStart(pointerCoord(ev).x);
  }

  onDragMove(ev: any) {
    ev.preventDefault();

    this.toggle._onDragMove(pointerCoord(ev).x);
  }

  onDragEnd(ev: any) {
    ev.preventDefault();

    this.toggle._onDragEnd(pointerCoord(ev).x);
  }
}
