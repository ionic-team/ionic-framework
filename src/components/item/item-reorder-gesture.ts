import { Item } from './item';
import { ItemReorder, indexForItem, findReorderItem } from '../item/item-reorder';
import { UIEventManager } from '../../util/ui-event-manager';
import { closest, Coordinates, pointerCoord, CSS, nativeRaf } from '../../util/dom';


const AUTO_SCROLL_MARGIN = 60;
const SCROLL_JUMP = 10;
const ITEM_REORDER_ACTIVE = 'reorder-active';

/**
 * @private
 */
export class ItemReorderGesture {
  private selectedItemEle: HTMLElement = null;
  private selectedItemHeight: number;

  private offset: Coordinates;
  private lastToIndex: number;
  private lastYcoord: number;
  private lastScrollPosition: number;
  private emptyZone: boolean;

  private windowHeight: number;

  private events: UIEventManager = new UIEventManager(false);

  constructor(public list: ItemReorder) {
    let element = this.list.getNativeElement();
    this.events.pointerEvents(element,
      this.onDragStart.bind(this),
      this.onDragMove.bind(this),
      this.onDragEnd.bind(this));
  }

  private onDragStart(ev: any): boolean {
    let reorderElement = ev.target;
    if (reorderElement.nodeName !== 'ION-REORDER') {
      return false;
    }

    let reorderMark = reorderElement['$ionComponent'];
    if (!reorderMark) {
      console.error('ion-reorder does not contain $ionComponent');
      return false;
    }
    this.list.reorderPrepare();

    let item = reorderMark.getReorderNode();
    if (!item) {
      console.error('reorder node not found');
      return false;
    }
    ev.preventDefault();

    // Preparing state
    this.selectedItemEle = item;
    this.selectedItemHeight = item.offsetHeight;
    this.lastYcoord = -100;
    this.lastToIndex = indexForItem(item);

    this.windowHeight = window.innerHeight - AUTO_SCROLL_MARGIN;
    this.lastScrollPosition = this.list.scrollContent(0);

    this.offset = pointerCoord(ev);
    this.offset.y += this.lastScrollPosition;

    item.classList.add(ITEM_REORDER_ACTIVE);
    this.list.reorderStart();
    return true;
  }

  private onDragMove(ev: any) {
    let selectedItem = this.selectedItemEle;
    if (!selectedItem) {
      return;
    }
    ev.preventDefault();

    // Get coordinate
    let coord = pointerCoord(ev);
    let posY = coord.y;

    // Scroll if we reach the scroll margins
    let scrollPosition = this.scroll(posY);

    // Only perform hit test if we moved at least 30px from previous position
    if (Math.abs(posY - this.lastYcoord) > 30) {
      let overItem = this.itemForCoord(coord);
      if (overItem) {
        let toIndex = indexForItem(overItem);
        if (toIndex !== undefined && (toIndex !== this.lastToIndex || this.emptyZone)) {
          let fromIndex = indexForItem(this.selectedItemEle);
          this.lastToIndex = toIndex;
          this.lastYcoord = posY;
          this.emptyZone = false;
          this.list.reorderMove(fromIndex, toIndex, this.selectedItemHeight);
        }
      } else {
        this.emptyZone = true;
      }
    }

    // Update selected item position
    let ydiff = Math.round(posY - this.offset.y + scrollPosition);
    selectedItem.style[CSS.transform] = `translateY(${ydiff}px)`;
  }

  private onDragEnd() {
    if (!this.selectedItemEle) {
      return;
    }

    let toIndex = this.lastToIndex;
    let fromIndex = indexForItem(this.selectedItemEle);
    let reorderInactive = () => {
      this.selectedItemEle.style.transition = '';
      this.selectedItemEle.classList.remove(ITEM_REORDER_ACTIVE);
      this.selectedItemEle = null;
    };

    if (toIndex === fromIndex) {
      this.selectedItemEle.style.transition = 'transform 200ms ease-in-out';
      setTimeout(reorderInactive, 200);
    } else {
      reorderInactive();
    }
    this.list.reorderEmit(fromIndex, toIndex);
  }

  private itemForCoord(coord: Coordinates): HTMLElement {
    return itemForPosition(this.offset.x - 100, coord.y);
  }

  private scroll(posY: number): number {
    if (posY < AUTO_SCROLL_MARGIN) {
      this.lastScrollPosition = this.list.scrollContent(-SCROLL_JUMP);
    } else if (posY > this.windowHeight) {
      this.lastScrollPosition = this.list.scrollContent(SCROLL_JUMP);
    }
    return this.lastScrollPosition;
  }

  /**
   * @private
   */
  destroy() {
    this.onDragEnd();
    this.events.unlistenAll();
    this.events = null;
    this.list = null;
  }
}

function itemForPosition(x: number, y: number): HTMLElement {
  let element = <HTMLElement>document.elementFromPoint(x, y);
  if (!element) {
    return null;
  }
  if (element.nodeName !== 'ION-ITEM' && !element.hasAttribute('ion-item')) {
    return null;
  }
  return findReorderItem(element);
}
