import { Component, Element, Prop, PropDidChange, State } from '@stencil/core';
import { DomController, GestureDetail } from '../../index';
import { clamp, reorderArray } from '../../utils/helpers';
import { hapticSelectionChanged, hapticSelectionEnd, hapticSelectionStart} from '../../utils/haptic';
import { CSS_PROP } from '../animation-controller/constants';

const AUTO_SCROLL_MARGIN = 60;
const SCROLL_JUMP = 10;
const ITEM_REORDER_SELECTED = 'reorder-selected';


export class ReorderIndexes {
  constructor(public from: number, public to: number) {}

  applyTo(array: any) {
    reorderArray(array, this);
  }
}

@Component({
  tag: 'ion-reorder-group',
  styleUrl: 'reorder-group.scss',
  host: {
    theme: 'reorder-group'
  }
})
export class ReorderGroup {
  private selectedItemEl: HTMLElement = null;
  private selectedItemHeight: number;
  private lastToIndex: number;
  private cachedHeights: number[] = [];
  private containerEl: HTMLElement;
  private scrollEl: HTMLElement;

  private scrollElTop: number;
  private scrollElBottom: number;
  private scrollElInitial: number;

  private containerTop: number;
  private containerBottom: number;

  @State() _enabled: boolean = false;
  @State() _iconVisible: boolean = false;
  @State() _actived: boolean = false;

  @Element() private el: HTMLElement;

  @Prop({ context: 'dom' }) dom: DomController;

  @Prop() enabled: boolean = false;

  /**
   * @input {string} Which side of the view the ion-reorder should be placed. Default `"end"`.
   */
  @PropDidChange('enabled')
  protected enabledChanged(enabled: boolean) {
    if (enabled) {
      this._enabled = true;
      this.dom.raf(() => {
        this._iconVisible = true;
      });
    } else {
      this._iconVisible = false;
      setTimeout(() => this._enabled = false, 400);
    }
  }

  componentDidLoad() {
    this.containerEl = this.el.querySelector('ion-gesture') as HTMLElement;
    this.scrollEl = this.el.closest('ion-scroll') as HTMLElement;
  }

  componentDidUnload() {
    this.onDragEnd();
  }

  private canStart(ev: GestureDetail): boolean {
    if (this.selectedItemEl) {
      return false;
    }
    const target = ev.event.target as HTMLElement;
    const reorderEl = target.closest('ion-reorder') as HTMLElement;
    if (!reorderEl) {
      return false;
    }
    const item = findReorderItem(reorderEl, this.containerEl);
    if (!item) {
      console.error('reorder node not found');
      return false;
    }
    ev.data = item;
    return true;
  }

  private onDragStart(ev: GestureDetail) {
    if (ev.event) {
      ev.event.preventDefault();
      ev.event.stopPropagation();
    }

    const item = this.selectedItemEl = ev.data;
    const heights = this.cachedHeights;
    heights.length = 0;
    const el = this.containerEl;
    const children: any = el.children;
    if (!children || children.length === 0) {
      return;
    }

    let sum = 0;
    for (var i = 0, ilen = children.length; i < ilen; i++) {
      var child = children[i];
      sum += child.offsetHeight;
      heights.push(sum);
      child.$ionIndex = i;
    }

    const box = this.containerEl.getBoundingClientRect();
    this.containerTop = box.top;
    this.containerBottom = box.bottom;

    if (this.scrollEl) {
      var scrollBox = this.scrollEl.getBoundingClientRect();
      this.scrollElInitial = this.scrollEl.scrollTop;
      this.scrollElTop = scrollBox.top + AUTO_SCROLL_MARGIN;
      this.scrollElBottom = scrollBox.bottom - AUTO_SCROLL_MARGIN;
    } else {
      this.scrollElInitial = 0;
      this.scrollElTop = 0;
      this.scrollElBottom = 0;
    }

    this.lastToIndex = indexForItem(item);
    this.selectedItemHeight = item.offsetHeight;
    this._actived = true;

    item.classList.add(ITEM_REORDER_SELECTED);

    hapticSelectionStart();
  }

  private onDragMove(ev: GestureDetail) {
    const selectedItem = this.selectedItemEl;
    if (!selectedItem) {
      return;
    }
    // Scroll if we reach the scroll margins
    const scroll = this.autoscroll(ev.currentY);

    // // Get coordinate
    const top = this.containerTop - scroll;
    const bottom = this.containerBottom - scroll;
    const currentY = clamp(top, ev.currentY, bottom);
    const deltaY = scroll + currentY - ev.startY;
    const normalizedY = currentY - top;
    const toIndex = this.itemIndexForTop(normalizedY);
    if (toIndex !== undefined && (toIndex !== this.lastToIndex)) {
      let fromIndex = indexForItem(selectedItem);
      this.lastToIndex = toIndex;

      hapticSelectionChanged();
      this._reorderMove(fromIndex, toIndex);
    }

    // Update selected item position
    (selectedItem.style as any)[CSS_PROP.transformProp] = `translateY(${deltaY}px)`;
  }

  private onDragEnd() {
    this._actived = false;
    const selectedItem = this.selectedItemEl;
    if (!selectedItem) {
      return;
    }

    const children = this.containerEl.children as any;
    const toIndex = this.lastToIndex;
    const fromIndex = indexForItem(selectedItem);

    const ref = (fromIndex < toIndex)
      ? children[toIndex + 1]
      : children[toIndex];

    this.containerEl.insertBefore(this.selectedItemEl, ref);

    const len = children.length;
    const transform = CSS_PROP.transformProp;
    for (let i = 0; i < len; i++) {
      children[i].style[transform] = '';
    }

    const reorderInactive = () => {
      this.selectedItemEl.style.transition = '';
      this.selectedItemEl.classList.remove(ITEM_REORDER_SELECTED);
      this.selectedItemEl = null;
    };
    if (toIndex === fromIndex) {
      selectedItem.style.transition = 'transform 200ms ease-in-out';
      setTimeout(reorderInactive, 200);
    } else {
      reorderInactive();
    }

    hapticSelectionEnd();
  }

  private itemIndexForTop(deltaY: number): number {
    const heights = this.cachedHeights;
    let i = 0;

    // TODO: since heights is a sorted array of integers, we can do
    // speed up the search using binary search. Remember that linear-search is still
    // faster than binary-search for small arrays (<64) due CPU branch misprediction.
    for (i = 0; i < heights.length; i++) {
      if (heights[i] > deltaY) {
        break;
      }
    }
    return i;
  }

  /********* DOM WRITE ********* */
  private _reorderMove(fromIndex: number, toIndex: number) {
    const itemHeight = this.selectedItemHeight;
    const children = this.containerEl.children;
    const transform = CSS_PROP.transformProp;
    for (var i = 0; i < children.length; i++) {
      var style = (children[i] as any).style;
      var value = '';
      if (i > fromIndex && i <= toIndex) {
        value = `translateY(${-itemHeight}px)`;
      } else if (i < fromIndex && i >= toIndex) {
        value = `translateY(${itemHeight}px)`;
      }
      style[transform] = value;
    }
  }

  private autoscroll(posY: number): number {
    if (!this.scrollEl) {
      return 0;
    }

    let amount = 0;
    if (posY < this.scrollElTop) {
      amount = -SCROLL_JUMP;
    } else if (posY > this.scrollElBottom) {
      amount = SCROLL_JUMP;
    }
    if (amount !== 0) {
      this.scrollEl.scrollBy(0, amount);
    }
    return this.scrollEl.scrollTop - this.scrollElInitial;
  }

  hostData() {
    return {
      class: {
        'reorder-enabled': this._enabled,
        'reorder-list-active': this._actived,
        'reorder-visible': this._iconVisible
      }
    };
  }

  render() {
    return (
      <ion-gesture {...{
        disableScroll: true,
        canStart: this.canStart.bind(this),
        onStart: this.onDragStart.bind(this),
        onMove: this.onDragMove.bind(this),
        onEnd: this.onDragEnd.bind(this),
        enabled: this.enabled,
        gestureName: 'reorder',
        gesturePriority: 30,
        type: 'pan',
        direction: 'y',
        threshold: 0,
        attachTo: 'body'
      }}>
        <slot></slot>
      </ion-gesture>
    );
  }
}

/**
 * @hidden
 */
function indexForItem(element: any): number {
  return element['$ionIndex'];
}

/**
 * @hidden
 */
function findReorderItem(node: HTMLElement, container: HTMLElement): HTMLElement {
  let nested = 0;
  let parent;
  while (node && nested < 6) {
    parent = node.parentNode as HTMLElement;
    if (parent === container) {
      return node;
    }
    node = parent;
    nested++;
  }
  return null;
}
