import { Component, Element, Prop, State, Watch } from '@stencil/core';
import { GestureDetail, QueueController } from '../../index';
import { hapticSelectionChanged, hapticSelectionEnd, hapticSelectionStart} from '../../utils/haptic';

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

  private selectedItemEl: HTMLElement|undefined;
  private selectedItemHeight!: number;
  private lastToIndex!: number;
  private cachedHeights: number[] = [];
  private containerEl!: HTMLElement;
  private scrollEl: HTMLElement|null = null;

  private scrollElTop = 0;
  private scrollElBottom = 0;
  private scrollElInitial = 0;

  private containerTop = 0;
  private containerBottom = 0;

  @State() enabled = false;
  @State() iconVisible = false;
  @State() activated = false;

  @Element() el!: HTMLElement;

  @Prop({ context: 'queue' }) queue!: QueueController;

  /**
   * If true, the reorder will be hidden. Defaults to `true`.
   */
  @Prop() disabled = true;

  @Watch('disabled')
  protected disabledChanged(disabled: boolean) {
    if (!disabled) {
      this.enabled = true;
      this.queue.read(() => {
        this.iconVisible = true;
      });
    } else {
      this.iconVisible = false;
      setTimeout(() => this.enabled = false, 400);
    }
  }

  componentDidLoad() {
    this.containerEl = this.el.querySelector('ion-gesture')!;
    this.scrollEl = this.el.closest('ion-scroll');
    if (!this.disabled) {
      this.disabledChanged(false);
    }
  }

  componentDidUnload() {
    this.onDragEnd();
  }

  private canStart(ev: GestureDetail): boolean {
    if (this.selectedItemEl) {
      return false;
    }
    const target = ev.event.target as HTMLElement;
    const reorderEl = target.closest('ion-reorder');
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
    const item = this.selectedItemEl = ev.data;
    const heights = this.cachedHeights;
    heights.length = 0;
    const el = this.containerEl;
    const children: any = el.children;
    if (!children || children.length === 0) {
      return;
    }

    let sum = 0;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      sum += child.offsetHeight;
      heights.push(sum);
      child.$ionIndex = i;
    }

    const box = this.containerEl.getBoundingClientRect();
    this.containerTop = box.top;
    this.containerBottom = box.bottom;

    if (this.scrollEl) {
      const scrollBox = this.scrollEl.getBoundingClientRect();
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
    this.activated = true;

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
    const currentY = Math.max(top, Math.min(ev.currentY, bottom));
    const deltaY = scroll + currentY - ev.startY;
    const normalizedY = currentY - top;
    const toIndex = this.itemIndexForTop(normalizedY);
    if (toIndex !== undefined && (toIndex !== this.lastToIndex)) {
      const fromIndex = indexForItem(selectedItem);
      this.lastToIndex = toIndex;

      hapticSelectionChanged();
      this.reorderMove(fromIndex, toIndex);
    }

    // Update selected item position
    selectedItem.style.transform = `translateY(${deltaY}px)`;
  }

  private onDragEnd() {
    this.activated = false;
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

    this.containerEl.insertBefore(selectedItem, ref);

    const len = children.length;
    for (let i = 0; i < len; i++) {
      children[i].style['transform'] = '';
    }

    const reorderInactive = () => {
      if (this.selectedItemEl) {
        this.selectedItemEl.style.transition = '';
        this.selectedItemEl.classList.remove(ITEM_REORDER_SELECTED);
        this.selectedItemEl = undefined;
      }
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
  private reorderMove(fromIndex: number, toIndex: number) {
    const itemHeight = this.selectedItemHeight;
    const children = this.containerEl.children;
    for (let i = 0; i < children.length; i++) {
      const style = (children[i] as any).style;
      let value = '';
      if (i > fromIndex && i <= toIndex) {
        value = `translateY(${-itemHeight}px)`;
      } else if (i < fromIndex && i >= toIndex) {
        value = `translateY(${itemHeight}px)`;
      }
      style['transform'] = value;
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
        'reorder-enabled': this.enabled,
        'reorder-list-active': this.activated,
        'reorder-visible': this.iconVisible
      }
    };
  }

  render() {
    return (
      <ion-gesture {...{
        canStart: this.canStart.bind(this),
        onStart: this.onDragStart.bind(this),
        onMove: this.onDragMove.bind(this),
        onEnd: this.onDragEnd.bind(this),
        disabled: this.disabled,
        disableScroll: true,
        gestureName: 'reorder',
        gesturePriority: 30,
        type: 'pan',
        direction: 'y',
        threshold: 0,
        attachTo: 'window'
      }}>
        <slot></slot>
      </ion-gesture>
    );
  }
}

function indexForItem(element: any): number {
  return element['$ionIndex'];
}

function findReorderItem(node: HTMLElement, container: HTMLElement): HTMLElement|null {
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

export function reorderArray(array: any[], indexes: {from: number, to: number}): any[] {
  const element = array[indexes.from];
  array.splice(indexes.from, 1);
  array.splice(indexes.to, 0, element);
  return array;
}

