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
  private selectedItemEle: HTMLElement = null;
  private selectedItemHeight: number;

  private offset: Coordinates;
  private lastToIndex: number;
  private lastYcoord: number;
  private lastScrollPosition: number;
  private emptyZone: boolean;

  private windowHeight: number;

  private events: UIEventManager = new UIEventManager(false);

  constructor(public list: List) {
    let element = this.list.getNativeElement();
    this.events.pointerEvents(element,
      this.onDragStart.bind(this),
      this.onDragMove.bind(this),
      this.onDragEnd.bind(this));
  }

  private onDragStart(ev: any): boolean {
    let itemEle = ev.target;
    if (itemEle.nodeName !== 'ION-REORDER') {
      return false;
    }

    let item = <Item> itemEle['$ionComponent'];
    if (!item) {
      console.error('item does not contain ion component');
      return false;
    }
    ev.preventDefault();

    // Preparing state
    this.selectedItem = item;
    this.selectedItemEle = item.getNativeElement();
    this.selectedItemHeight = item.height();
    this.lastToIndex = item.index;
    this.lastYcoord = -100;

    this.windowHeight = window.innerHeight - AUTO_SCROLL_MARGIN;
    this.lastScrollPosition = this.list.scrollContent(0);

    this.offset = pointerCoord(ev);
    this.offset.y += this.lastScrollPosition;

    item.setCssClass(ITEM_REORDER_ACTIVE, true);
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
        let toIndex = overItem.index;      
        if (toIndex !== this.lastToIndex || this.emptyZone) {
          let fromIndex = this.selectedItem.index;
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

    nativeRaf(() => {
      let toIndex = this.lastToIndex;
      let fromIndex = this.selectedItem.index;
      this.selectedItem.setCssClass(ITEM_REORDER_ACTIVE, false);
      this.selectedItem = null;
      this.selectedItemEle = null;
      this.list.reorderEmit(fromIndex, toIndex);
    });   
  }

  private itemForCoord(coord: Coordinates): Item {
    let element = <HTMLElement>document.elementFromPoint(this.offset.x - 100, coord.y);
    if (!element) {
      return null;
    }
    if (element.nodeName !== 'ION-ITEM') {
      return null;
    }
    let item = <Item>(<any>element)['$ionComponent'];
    if (!item) {
      console.error('item does not have $ionComponent');
      return null;
    }
    return item;
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
