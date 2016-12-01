import { GestureController, GesturePriority, GESTURE_TOGGLE } from '../../gestures/gesture-controller';
import { PanGesture } from '../../gestures/drag-gesture';
import { pointerCoord } from '../../util/dom';
import { NativeRafDebouncer } from '../../util/debouncer';
import { Toggle } from './toggle';

/**
 * @private
 */
export class ToggleGesture extends PanGesture {

  constructor(public toogle: Toggle, gestureCtrl: GestureController) {
    super(toogle.getNativeElement(), {
      maxAngle: 20,
      threshold: 0,
      debouncer: new NativeRafDebouncer(),
      gesture: gestureCtrl.createGesture({
        name: GESTURE_TOGGLE,
        priority: GesturePriority.Toggle,
      })
    });
  }

  canStart(ev: any): boolean {
    return true;
  }

  onDragStart(ev: any) {
    ev.preventDefault();

    this.toogle._onDragStart(pointerCoord(ev).x);
  }

  onDragMove(ev: any) {
    ev.preventDefault();

    this.toogle._onDragMove(pointerCoord(ev).x);
  }

  onDragEnd(ev: any) {
    ev.preventDefault();

    this.toogle._onDragEnd(pointerCoord(ev).x);
  }
}
