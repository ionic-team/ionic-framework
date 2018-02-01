import { Component, Element, EventListenerEnable, Listen, Method, Prop, Watch } from '@stencil/core';
import { DomController } from '../../index';
import { Cell, CellType, DomRenderFn, HeaderFn, ItemHeightFn, ItemRenderFn, NodeHeightFn,
  Viewport, VirtualNode, calcHeightIndex, doRender, getBounds, getShouldUpdate, getViewport, updateVDom } from './virtual-scroll-utils';


const MIN_READS = 2;

@Component({
  tag: 'ion-virtual-scroll',
  styleUrl: 'virtual-scroll.scss'
})
export class VirtualScroll {

  private scrollEl: HTMLElement;
  private topIndex = -100;
  private bottomIndex = -100;
  private timerUpdate: any;
  private heightIndex: Uint32Array;
  private viewportHeight: number;
  private cells: Cell[] = [];
  private virtualDom: VirtualNode[] = [];
  private isEnabled = false;
  private currentScrollTop = 0;
  private indexDirty = 0;
  private totalHeight = 0;

  @Element() el: HTMLElement;

  @Prop({context: 'dom'}) dom: DomController;
  @Prop({context: 'enableListener'}) enableListener: EventListenerEnable;


  /**
   * It is important to provide this
   * if virtual item height will be significantly larger than the default
   * The approximate height of each virtual item template's cell.
   * This dimension is used to help determine how many cells should
   * be created when initialized, and to help calculate the height of
   * the scrollable area. This height value can only use `px` units.
   * Note that the actual rendered size of each cell comes from the
   * app's CSS, whereas this approximation is used to help calculate
   * initial dimensions before the item has been rendered. Default is
   * `45`.
   */
  @Prop() approxItemHeight = 45;

  /**
   * The approximate height of each header template's cell.
   * This dimension is used to help determine how many cells should
   * be created when initialized, and to help calculate the height of
   * the scrollable area. This height value can only use `px` units.
   * Note that the actual rendered size of each cell comes from the
   * app's CSS, whereas this approximation is used to help calculate
   * initial dimensions before the item has been rendered. Default is `40px`.
   */
  @Prop() approxHeaderHeight = 40;

  /**
   * The approximate width of each footer template's cell.
   * This dimension is used to help determine how many cells should
   * be created when initialized, and to help calculate the height of
   * the scrollable area. This value can use either `px` or `%` units.
   * Note that the actual rendered size of each cell comes from the
   * app's CSS, whereas this approximation is used to help calculate
   * initial dimensions before the item has been rendered. Default is `100%`.
   */
  @Prop() approxFooterHeight = 40;

  /**
   * Section headers and the data used within its given
   * template can be dynamically created by passing a function to `headerFn`.
   * For example, a large list of contacts usually has dividers between each
   * letter in the alphabet. App's can provide their own custom `headerFn`
   * which is called with each record within the dataset. The logic within
   * the header function can decide if the header template should be used,
   * and what data to give to the header template. The function must return
   * `null` if a header cell shouldn't be created.
   */
  @Prop() headerFn: HeaderFn;

  /**
   * Section footers and the data used within its given
   * template can be dynamically created by passing a function to `footerFn`.
   * The logic within the footer function can decide if the footer template
   * should be used, and what data to give to the footer template. The function
   * must return `null` if a footer cell shouldn't be created.
   */
  @Prop() footerFn: HeaderFn;

  /**
   * The data that builds the templates within the virtual scroll.
   * This is the same data that you'd pass to `*ngFor`. It's important to note
   * that when this data has changed, then the entire virtual scroll is reset,
   * which is an expensive operation and should be avoided if possible.
   */
  @Prop() items: any[];

  @Prop() nodeHeight: NodeHeightFn;
  @Prop() itemHeight: ItemHeightFn;
  @Prop() itemRender: ItemRenderFn;
  @Prop() domRender: DomRenderFn;

  @Watch('itemHeight')
  @Watch('items')
  itemsChanged() {
    this.calcCells();
  }

  componentDidLoad() {
    this.scrollEl = this.el.closest('ion-scroll') as HTMLElement;
    if (!this.scrollEl) {
      console.error('virtual-scroll must be used inside ion-scroll/ion-content');
      return;
    }
    this.calcDimensions();
    this.calcCells();
    this.updateState();
  }

  componentDidUpdate() {
    this.updateState();
  }

  componentDidUnload() {
    this.scrollEl = null;
  }

  @Listen('scroll', {enabled: false, passive: false})
  onScroll() {
    this.updateVirtualScroll();
  }

  @Listen('window:resize')
  onResize() {
    this.indexDirty = 0;
    this.calcDimensions();
    this.calcCells();
    this.updateVirtualScroll();
  }

  @Method()
  positionForItem(index: number): number {
    const cell = this.cells.find(cell => cell.type === CellType.Item && cell.index === index);
    if (cell) {
      return this.heightIndex[cell.i];
    }
    return -1;
  }

  private updateVirtualScroll() {
    // do nothing if there is a scheduled update
    if (!this.isEnabled) {
      return;
    }
    if (this.timerUpdate) {
      clearTimeout(this.timerUpdate);
      this.timerUpdate = null;
    }

    this.dom.read(() => {
      this.currentScrollTop = this.scrollEl.scrollTop;
    });

    this.dom.write(() => {
      const dirtyIndex = this.indexDirty;

      // get visible viewport
      const viewport = getViewport(this.currentScrollTop, this.viewportHeight, 100);

      // compute lazily the height index
      const heightIndex = this.getHeightIndex(viewport);

      // get array bounds of visible cells base in the viewport
      const {top, bottom} = getBounds(heightIndex, viewport, 2);

      // fast path, do nothing
      const shouldUpdate = getShouldUpdate(dirtyIndex, this.topIndex, this.bottomIndex, top, bottom);
      if (!shouldUpdate) {
        return;
      }
      this.topIndex = top;
      this.bottomIndex = bottom;

      // in place mutation of the virtual DOM
      updateVDom(
        this.virtualDom,
        heightIndex,
        this.cells,
        top,
        bottom);

      this.fireDomUpdate();
    });
  }

  private fireDomUpdate() {
    if (this.itemRender) {
      doRender(this.el, this.itemRender, this.virtualDom, this.updateCellHeight.bind(this), this.totalHeight);
    } else if (this.domRender) {
      this.domRender(this.virtualDom, this.totalHeight);
    }
  }

  updateCellHeight(cell: Cell, node: HTMLElement) {
    (node as any).componentOnReady(() => {
      // let's give some additional time to read the height size
      setTimeout(() => this.dom.read(() => {
        if ((node as any)['$ionCell'] === cell) {
          const style = window.getComputedStyle(node);
          const height = node.offsetHeight + parseFloat(style.getPropertyValue('margin-bottom'));
          this.setCellHeight(cell, height);
        }
      }));
    });
  }

  setCellHeight(cell: Cell, height: number) {
    const index = cell.i;
    // the cell might changed since the height update was scheduled
    if (cell !== this.cells[index]) {
      return;
    }
    cell.visible = true;
    cell.reads--;
    if (cell.height !== height) {
      console.debug(`[${cell.reads}] cell size ${cell.height} -> ${height}`);
      cell.height = height;
      clearTimeout(this.timerUpdate);
      this.indexDirty = Math.min(this.indexDirty, index);
      this.timerUpdate = setTimeout(() => this.updateVirtualScroll(), 100);
    }
  }

  private updateState() {
    const shouldEnable = !!(
      this.scrollEl &&
      this.cells &&
      (this.itemRender || this.domRender) &&
      this.viewportHeight > 1
    );
    if (shouldEnable !== this.isEnabled) {
      this.enableScrollEvents(shouldEnable);
      if (shouldEnable) {
        this.updateVirtualScroll();
      }
    }
  }


  private calcCells() {
    if (!this.items) {
      return;
    }
    const items = this.items;
    const cells = this.cells;
    const headerFn = this.headerFn;
    const footerFn = this.footerFn;

    cells.length = 0;
    this.indexDirty = 0;
    let j = 0;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (headerFn) {
        const value = headerFn(item, i, this.items);
        if (value != null) {
          cells.push({
            i: j++,
            type: CellType.Header,
            value: value,
            index: i,
            height: this.approxHeaderHeight,
            reads: MIN_READS,
            visible: false,
          });
        }
      }

      cells.push({
        i: j++,
        type: CellType.Item,
        value: item,
        index: i,
        height: this.itemHeight ? this.itemHeight(item, i) : this.approxItemHeight,
        reads: this.itemHeight ? 0 : MIN_READS,
        visible: !!this.itemHeight,
      });

      if (footerFn) {
        const value = footerFn(item, i, this.items);
        if (value != null) {
          cells.push({
            i: j++,
            type: CellType.Footer,
            value: value,
            index: i,
            height: this.approxFooterHeight,
            reads: 2,
            visible: false,
          });
        }
      }
    }
  }

  private getHeightIndex(viewport: Viewport): Uint32Array {
    if (this.indexDirty !== Infinity) {
      this.calcHeightIndex(this.indexDirty, viewport.bottom);
    }
    return this.heightIndex;
  }

  private calcHeightIndex(index = 0, bottom = Infinity) {
    this.heightIndex = calcHeightIndex(this.heightIndex, this.cells, index, bottom);
    this.totalHeight = this.heightIndex[this.heightIndex.length - 1];
    this.indexDirty = Infinity;
  }

  private calcDimensions() {
    this.viewportHeight = this.scrollEl.offsetHeight;
  }

  private enableScrollEvents(shouldListen: boolean) {
    this.isEnabled = shouldListen;
    this.enableListener(this, 'scroll', shouldListen, this.scrollEl);
  }
}
