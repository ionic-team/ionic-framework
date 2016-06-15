import {DragGesture} from '../../gestures/drag-gesture';
import {ItemSliding} from './item-sliding';
import {List} from '../list/list';

import {closest} from '../../util/dom';

const DRAG_THRESHOLD = 20;
const MAX_ATTACK_ANGLE = 20;

export class ItemSlidingGesture extends DragGesture {
  onTap: any;
  selectedContainer: ItemSliding = null;
  openContainer: ItemSliding = null;

  constructor(public list: List, public listEle: HTMLElement) {
    super(listEle, {
      direction: 'x',
      threshold: DRAG_THRESHOLD
    });
    this.listen();
  }

  onTapCallback(ev: any) {
    if (isFromOptionButtons(ev.target)) {
      return;
    }
    let didClose = this.closeOpened();
    if (didClose) {
      console.debug('tap close sliding item, preventDefault');
      ev.preventDefault();
    }
  }

  onDragStart(ev: any): boolean {
    let angle = Math.abs(ev.angle);
    if (angle > MAX_ATTACK_ANGLE && Math.abs(angle - 180) > MAX_ATTACK_ANGLE) {
      this.closeOpened();
      return false;
    }

    if (this.selectedContainer) {
      console.debug('onDragStart, another container is already selected');
      return false;
    }

    let container = getContainer(ev);
    if (!container) {
      console.debug('onDragStart, no itemContainerEle');
      return false;
    }

    // Close open container if it is not the selected one.
    if (container !== this.openContainer) {
      this.closeOpened();
    }

    this.selectedContainer = container;
    this.openContainer = container;
    container.startSliding(ev.center.x);

    return true;
  }

  onDrag(ev: any): boolean {
    if (this.selectedContainer) {
      this.selectedContainer.moveSliding(ev.center.x);
      ev.preventDefault();
    }
    return;
  }

  onDragEnd(ev: any) {
    if (this.selectedContainer) {
      ev.preventDefault();

      let openAmount = this.selectedContainer.endSliding(ev.velocityX);
      this.selectedContainer = null;

      // TODO: I am not sure listening for a tap event is the best idea
      // we should try mousedown/touchstart
      if (openAmount === 0) {
        this.openContainer = null;
        this.off('tap', this.onTap);
        this.onTap = null;
      } else if (!this.onTap) {
        this.onTap = (event: any) => this.onTapCallback(event);
        this.on('tap', this.onTap);
      }
    }
  }

  closeOpened(): boolean {
    if (this.openContainer) {
      this.openContainer.close();
      this.openContainer = null;
      this.selectedContainer = null;
      this.off('tap', this.onTap);
      this.onTap = null;
      return true;
    }
    return false;
  }

  unlisten() {
    super.unlisten();
    this.listEle = null;
  }
}

function getContainer(ev: any): ItemSliding {
  let ele = closest(ev.target, 'ion-item-sliding', true);
  if (ele) {
    return (<any>ele)['$ionComponent'];
  }
  return null;
}

function isFromOptionButtons(ele: HTMLElement): boolean {
  return !!closest(ele, 'ion-item-options', true);
}
