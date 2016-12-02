import { GestureController, GesturePriority, GESTURE_TOGGLE } from '../../gestures/gesture-controller';
import { PanGesture } from '../../gestures/drag-gesture';
import { pointerCoord } from '../../util/dom';
import { DomController } from '../../util/dom-controller';
import { Toggle } from './toggle';

/**
 * @private
 */
export class ToggleGesture extends PanGesture {

  constructor(
    public toogle: Toggle,
    gestureCtrl: GestureController,
    domCtrl: DomController
  ) {
    super(toogle.getNativeElement(), {
      threshold: 0,
      domController: domCtrl,
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
