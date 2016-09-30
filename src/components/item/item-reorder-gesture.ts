import { PointerCoordinates, CSS, pointerCoord } from '../../util/dom';
import { ItemReorder, indexForItem, findReorderItem } from '../item/item-reorder';
import { UIEventManager } from '../../util/ui-event-manager';


const AUTO_SCROLL_MARGIN = 60;
const SCROLL_JUMP = 10;
const ITEM_REORDER_ACTIVE = 'reorder-active';

/**
 * @private
 */
export class ItemReorderGesture {
  private selectedItemEle: HTMLElement = null;
  private selectedItemHeight: number;

  private offset: PointerCoordinates;
  private lastToIndex: number;
  private lastYcoord: number;
  private lastScrollPosition: number;
  private emptyZone: boolean;

  private windowHeight: number;

  private events: UIEventManager = new UIEventManager(false);

  constructor(public reorderList: ItemReorder) {
    this.events.pointerEvents({
      element: this.reorderList.getNativeElement(),
      pointerDown: this.onDragStart.bind(this),
      pointerMove: this.onDragMove.bind(this),
      pointerUp: this.onDragEnd.bind(this)
    });
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
    this.reorderList.reorderPrepare();

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
    this.lastScrollPosition = this.reorderList.scrollContent(0);

    this.offset = pointerCoord(ev);
    this.offset.y += this.lastScrollPosition;

    item.classList.add(ITEM_REORDER_ACTIVE);
    this.reorderList.reorderStart();
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
          this.reorderList.reorderMove(fromIndex, toIndex, this.selectedItemHeight);
        }
      } else {
        this.emptyZone = true;
      }
    }

    // Update selected item position
    let ydiff = Math.round(posY - this.offset.y + scrollPosition);
    (<any>selectedItem.style)[CSS.transform] = `translateY(${ydiff}px)`;
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
    this.reorderList.reorderEmit(fromIndex, toIndex);
  }

  private itemForCoord(coord: PointerCoordinates): HTMLElement {
    return itemForPosition(this.offset.x - 100, coord.y);
  }

  private scroll(posY: number): number {
    if (posY < AUTO_SCROLL_MARGIN) {
      this.lastScrollPosition = this.reorderList.scrollContent(-SCROLL_JUMP);
    } else if (posY > this.windowHeight) {
      this.lastScrollPosition = this.reorderList.scrollContent(SCROLL_JUMP);
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
    this.reorderList = null;
  }
}

function itemForPosition(x: number, y: number): HTMLElement {
  let element = <HTMLElement>document.elementFromPoint(x, y);
  return findReorderItem(element);
}
