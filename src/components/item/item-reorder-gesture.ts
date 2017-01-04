import { PointerCoordinates, CSS, pointerCoord } from '../../util/dom';
import { ItemReorder, indexForItem } from '../item/item-reorder';
import { UIEventManager } from '../../util/ui-event-manager';
import { NativeRafDebouncer } from '../../util/debouncer';

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

  private windowHeight: number;
  private topOfList: number;

  private events: UIEventManager = new UIEventManager(false);
  private debouncer: NativeRafDebouncer = new NativeRafDebouncer();
  private cachedHeights;

  constructor(public reorderList: ItemReorder) {
    this.events.pointerEvents({
      element: this.reorderList.getNativeElement(),
      pointerDown: this.onDragStart.bind(this),
      pointerMove: this.onDragMove.bind(this),
      pointerUp: this.onDragEnd.bind(this)
    });
  }

  private onDragStart(ev: any): boolean {
    if (this.selectedItemEle) {
      return false;
    }
    let reorderElement = ev.target;
    if (reorderElement.nodeName !== 'ION-REORDER') {
      return false;
    }

    let reorderMark = reorderElement['$ionComponent'];
    if (!reorderMark) {
      console.error('ion-reorder does not contain $ionComponent');
      return false;
    }
    this.cachedHeights = this.reorderList._reorderPrepare();

    let item = reorderMark.getReorderNode();
    if (!item) {
      console.error('reorder node not found');
      return false;
    }
    ev.preventDefault();

    // Preparing state
    this.selectedItemEle = item;
    this.lastYcoord = -100;
    this.lastToIndex = indexForItem(item);
    this.selectedItemHeight = this.cachedHeights[this.lastToIndex];
    this.topOfList = this.reorderList._reorderTopOfList();
    this.windowHeight = window.innerHeight - AUTO_SCROLL_MARGIN;
    this.lastScrollPosition = this.reorderList._scrollContent(0);

    this.offset = pointerCoord(ev);
    this.offset.y += this.lastScrollPosition;

    item.classList.add(ITEM_REORDER_ACTIVE);
    this.reorderList._reorderStart();
    return true;
  }

  private onDragMove(ev: any) {
    let selectedItem = this.selectedItemEle;
    if (!selectedItem) {
      return;
    }
    ev.preventDefault();

    this.debouncer.debounce(() => {
      // Get coordinate
      let coord = pointerCoord(ev);
      let posY = coord.y;

      // Scroll if we reach the scroll margins
      let scrollPosition = this.scroll(posY);

      // Only perform hit test if we moved at least 30px from previous position
      if (Math.abs(posY - this.lastYcoord) > 30) {
        let toIndex = this.itemIndexForCoord(coord);
        if (toIndex !== undefined && (toIndex !== this.lastToIndex)) {
          let fromIndex = indexForItem(selectedItem);
          this.lastToIndex = toIndex;
          this.lastYcoord = posY;
          this.reorderList._reorderMove(fromIndex, toIndex, this.selectedItemHeight);
        }
      }

      // Update selected item position
      let ydiff = Math.round(posY - this.offset.y + scrollPosition);
      (<any>selectedItem.style)[CSS.transform] = `translateY(${ydiff}px)`;
    });
  }

  private onDragEnd(ev: any) {
    this.debouncer.cancel();

    let selectedItem = this.selectedItemEle;
    if (!selectedItem) {
      return;
    }
    if (ev) {
      ev.preventDefault();
      ev.stopPropagation();
    }

    let toIndex = this.lastToIndex;
    let fromIndex = indexForItem(selectedItem);
    let reorderInactive = () => {
      this.selectedItemEle.style.transition = '';
      this.selectedItemEle.classList.remove(ITEM_REORDER_ACTIVE);
      this.selectedItemEle = null;
    };

    if (toIndex === fromIndex) {
      selectedItem.style.transition = 'transform 200ms ease-in-out';
      setTimeout(reorderInactive, 200);
    } else {
      reorderInactive();
    }
    this.reorderList._reorderEmit(fromIndex, toIndex);
  }

  private itemIndexForCoord(coord: PointerCoordinates): number {
    let heights = this.cachedHeights;
    let sum = this.topOfList;
    let i = 0;
    for (; i < heights.length; i++) {
      sum += heights[i];
      if (sum > coord.y) {
        return i;
      }
    }
    return undefined;
  }

  private scroll(posY: number): number {
    if (posY < AUTO_SCROLL_MARGIN) {
      this.lastScrollPosition = this.reorderList._scrollContent(-SCROLL_JUMP);
    } else if (posY > this.windowHeight) {
      this.lastScrollPosition = this.reorderList._scrollContent(SCROLL_JUMP);
    }
    return this.lastScrollPosition;
  }

  /**
   * @private
   */
  destroy() {
    this.onDragEnd(null);
    this.events.unlistenAll();
    this.events = null;
    this.reorderList = null;
  }
}

