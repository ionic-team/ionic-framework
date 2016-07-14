import { ItemSliding } from './item-sliding';
import { List } from '../list/list';

import { closest, Coordinates, pointerCoord } from '../../util/dom';
import { PointerEvents, UIEventManager } from '../../util/ui-event-manager';
import { GestureDelegate, GestureOptions, GesturePriority } from '../../gestures/gesture-controller';

const DRAG_THRESHOLD = 10;
const MAX_ATTACK_ANGLE = 20;

export class ItemSlidingGesture {
  private preSelectedContainer: ItemSliding = null;
  private selectedContainer: ItemSliding = null;
  private openContainer: ItemSliding = null;
  private events: UIEventManager = new UIEventManager(false);
  private panDetector: PanXRecognizer = new PanXRecognizer(DRAG_THRESHOLD, MAX_ATTACK_ANGLE);
  private pointerEvents: PointerEvents;
  private firstCoordX: number;
  private firstTimestamp: number;
  private gesture: GestureDelegate;

  constructor(public list: List) {
    this.gesture = list.gestureCtrl.create('item-sliding', {
      priority: GesturePriority.Interactive,
    });

    this.pointerEvents = this.events.pointerEvents({
      element: list.getNativeElement(),
      pointerDown: this.pointerStart.bind(this),
      pointerMove: this.pointerMove.bind(this),
      pointerUp: this.pointerEnd.bind(this),
    });
  }

  private pointerStart(ev: any): boolean {
    if (this.selectedContainer) {
      return false;
    }
    // Get swiped sliding container
    let container = getContainer(ev);
    if (!container) {
      this.closeOpened();
      return false;
    }

    // Close open container if it is not the selected one.
    if (container !== this.openContainer) {
      this.closeOpened();
    }

    // Try to start gesture
    if (!this.gesture.start()) {
      this.gesture.release();
      return false;
    }

    let coord = pointerCoord(ev);
    this.preSelectedContainer = container;
    this.panDetector.start(coord);
    this.firstCoordX = coord.x;
    this.firstTimestamp = Date.now();
    return true;
  }

  private pointerMove(ev: any) {
    if (this.selectedContainer) {
      this.onDragMove(ev);
      return;
    }
    let coord = pointerCoord(ev);
    if (this.panDetector.detect(coord)) {
      if (this.panDetector.isPanX() && this.gesture.capture()) {
          this.onDragStart(ev, coord);
          return;
      }

      // Detection/capturing was not successful, aborting!
      this.closeOpened();
      this.pointerEvents.stop();
    }
  }

  private pointerEnd(ev: any) {
    this.gesture.release();
    if (this.selectedContainer) {
      this.onDragEnd(ev);
    } else {
      this.closeOpened();
    }
  }

  private onDragStart(ev: any, coord: Coordinates): boolean {
    let container = getContainer(ev);
    if (!container) {
      console.debug('onDragStart, no itemContainerEle');
      return false;
    }
    ev.preventDefault();

    this.selectedContainer = this.openContainer = this.preSelectedContainer;
    container.startSliding(coord.x);
  }

  private onDragMove(ev: any) {
    let coordX = pointerCoord(ev).x;
    ev.preventDefault();
    this.selectedContainer.moveSliding(coordX);
  }

  private onDragEnd(ev: any) {
    ev.preventDefault();
    let coordX = pointerCoord(ev).x;
    let deltaX = (coordX - this.firstCoordX);
    let deltaT = (Date.now() - this.firstTimestamp);

    let openAmount = this.selectedContainer.endSliding(deltaX / deltaT);
    this.selectedContainer = null;
    this.preSelectedContainer = null;
  }

  closeOpened(): boolean {
    this.selectedContainer = null;
    this.gesture.release();

    if (this.openContainer) {
      this.openContainer.close();
      this.openContainer = null;
      return true;
    }
    return false;
  }

  destroy() {
    this.gesture.destroy();
    this.events.unlistenAll();
    this.closeOpened();

    this.list = null;
    this.preSelectedContainer = null;
    this.selectedContainer = null;
    this.openContainer = null;
  }
}

function getContainer(ev: any): ItemSliding {
  let ele = closest(ev.target, 'ion-item-sliding', true);
  if (ele) {
    return (<any>ele)['$ionComponent'];
  }
  return null;
}

class AngleRecognizer {
  private startCoord: Coordinates;
  private sumCoord: Coordinates;
  private dirty: boolean;
  private _angle: any = null;
  private threshold: number;

  constructor(threshold: number) {
    this.threshold = threshold ** 2;
  }

  start(coord: Coordinates) {
    this.startCoord = coord;
    this._angle = 0;
    this.dirty = true;
  }

  angle(): any {
    return this._angle;
  }

  detect(coord: Coordinates): boolean {
    if (!this.dirty) {
      return false;
    }
    let deltaX = (coord.x - this.startCoord.x);
    let deltaY = (coord.y - this.startCoord.y);
    let distance = deltaX * deltaX + deltaY * deltaY;
    if (distance >= this.threshold) {
      this._angle = Math.atan2(deltaY, deltaX);
      this.dirty = false;
      return true;
    }
    return false;
  }
}


class PanXRecognizer extends AngleRecognizer {
  private _isPanX: boolean;
  private maxAngle: number;

  constructor(threshold: number, maxAngle: number) {
    super(threshold);
    this.maxAngle = maxAngle * (Math.PI / 180);
  }

  start(coord: Coordinates) {
    super.start(coord);
    this._isPanX = false;
  }

  isPanX(): boolean {
    return this._isPanX;
  }

  detect(coord: Coordinates): boolean {
    if (super.detect(coord)) {
      let angle = Math.abs(this.angle());
      this._isPanX = (angle < this.maxAngle || Math.abs(angle - Math.PI) < this.maxAngle);
      return true;
    }
    return false;
  }
}
