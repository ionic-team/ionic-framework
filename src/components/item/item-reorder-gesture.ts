import {Item} from './item';
import {List} from '../list/list';
import {UIEventManager} from '../../util/ui-event-manager';
import {closest, Coordinates, pointerCoord, CSS, nativeRaf} from '../../util/dom';


const AUTO_SCROLL_MARGIN = 60;
const SCROLL_JUMP = 10;
const ITEM_REORDER_ACTIVE = 'reorder-active';

/**
 * @private
 */
export class ItemReorderGesture {
  private selectedItem: Item = null;
  private offset: Coordinates;
  private lastToIndex: number;
  private lastYcoord: number;
  private emptyZone: boolean;

  private itemHeight: number;
  private windowHeight: number;

  private events: UIEventManager = new UIEventManager(false);

  constructor(public list: List) {
    let element = this.list.getNativeElement();
    this.events.pointerEvents(element,
      (ev: any) => this.onDragStart(ev),
      (ev: any) => this.onDragMove(ev),
      (ev: any) => this.onDragEnd(ev));
  }

  private onDragStart(ev: any): boolean {
    let itemEle = ev.target;
    if (itemEle.nodeName !== 'ION-REORDER') {
      return false;
    }

    let item = itemEle['$ionComponent'];
    if (!item) {
      console.error('item does not contain ion component');
      return false;
    }
    ev.preventDefault();

    // Preparing state    
    this.offset = pointerCoord(ev);
    this.offset.y += this.list.scrollContent(0);
    this.selectedItem = item;
    this.itemHeight = item.height();
    this.lastToIndex = item.index;
    this.windowHeight = window.innerHeight - AUTO_SCROLL_MARGIN;
    item.setCssClass(ITEM_REORDER_ACTIVE, true);
    return true;
  }

  private onDragMove(ev: any) {
    if (!this.selectedItem) {
      return;
    }
    ev.preventDefault();

    // Get coordinate
    var coord = pointerCoord(ev);

    // Scroll if we reach the scroll margins
    let scrollPosition = this.scroll(coord);
    
    // Update selected item position    
    let ydiff = Math.round(coord.y - this.offset.y + scrollPosition);
    this.selectedItem.setCssStyle(CSS.transform, `translateY(${ydiff}px)`);

    // Only perform hit test if we moved at least 30px from previous position    
    if (Math.abs(coord.y - this.lastYcoord) < 30) {
      return;
    }

    // Hit test
    let overItem = this.itemForCoord(coord);      
    if (!overItem) {
      this.emptyZone = true;
      return;
    }

    // Move surrounding items if needed 
    let toIndex = overItem.index;
    if (toIndex !== this.lastToIndex || this.emptyZone) {
      let fromIndex = this.selectedItem.index;    
      this.lastToIndex = overItem.index;
      this.lastYcoord = coord.y;
      this.emptyZone = false;
      nativeRaf(() => {
        this.list.reorderMove(fromIndex, toIndex, this.itemHeight);
      });
    }
  }
 
  private onDragEnd(ev: any) {
    if (!this.selectedItem) {
      return;
    }

    nativeRaf(() => {
      let toIndex = this.lastToIndex;
      let fromIndex = this.selectedItem.index;
      this.selectedItem.setCssClass(ITEM_REORDER_ACTIVE, false);
      this.selectedItem = null;
      this.list.reorderEmit(fromIndex, toIndex);
    });   
  }

  private itemForCoord(coord: Coordinates): Item {
    let element = <any>document.elementFromPoint(this.offset.x - 100, coord.y);
    if (!element) {
      return null;
    }
    element = closest(element, 'ion-item', true);
    if (!element) {
      return null;
    }
    let item = <Item>(<any>element)['$ionComponent'];
    if (!item) {
      console.error('item does not have $ionComponent');
      return null;
    }
    return item;
  }

  private scroll(coord: Coordinates): number {
    let scrollDiff = 0;
    if (coord.y < AUTO_SCROLL_MARGIN) {
      scrollDiff = -SCROLL_JUMP;
    } else if (coord.y > this.windowHeight) {
      scrollDiff = SCROLL_JUMP;
    }
    return this.list.scrollContent(scrollDiff);
  }

  /**
   * @private
   */
  destroy() {
    this.events.unlistenAll();
    this.events = null;
    this.list = null;
  }
}
