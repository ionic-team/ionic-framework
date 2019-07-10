import { ChangeDetectionStrategy, Component, ContentChild, ElementRef, EmbeddedViewRef, IterableDiffer, IterableDiffers, NgZone, SimpleChanges, TrackByFunction } from '@angular/core';
import { Cell, CellType, HeaderFn, ItemHeightFn } from '@ionic/core';

import { proxyInputs, proxyMethods } from '../proxies-utils';

import { VirtualFooter } from './virtual-footer';
import { VirtualHeader } from './virtual-header';
import { VirtualItem } from './virtual-item';
import { VirtualContext } from './virtual-utils';

export declare interface IonVirtualScroll {
  /**
   * It is important to provide this
   * if virtual item height will be significantly larger than the default
   * The approximate height of each virtual item template's cell.
   * This dimension is used to help determine how many cells should
   * be created when initialized, and to help calculate the height of
   * the scrollable area. This height value can only use `px` units.
   * Note that the actual rendered size of each cell comes from the
   * app's CSS, whereas this approximation is used to help calculate
   * initial dimensions before the item has been rendered.
   */
  approxItemHeight: number;

  /**
   * The approximate height of each header template's cell.
   * This dimension is used to help determine how many cells should
   * be created when initialized, and to help calculate the height of
   * the scrollable area. This height value can only use `px` units.
   * Note that the actual rendered size of each cell comes from the
   * app's CSS, whereas this approximation is used to help calculate
   * initial dimensions before the item has been rendered.
   */
  approxHeaderHeight: number;

  /**
   * The approximate width of each footer template's cell.
   * This dimension is used to help determine how many cells should
   * be created when initialized, and to help calculate the height of
   * the scrollable area. This height value can only use `px` units.
   * Note that the actual rendered size of each cell comes from the
   * app's CSS, whereas this approximation is used to help calculate
   * initial dimensions before the item has been rendered.
   */
  approxFooterHeight: number;

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
  headerFn?: HeaderFn;

  /**
   * Section footers and the data used within its given
   * template can be dynamically created by passing a function to `footerFn`.
   * The logic within the footer function can decide if the footer template
   * should be used, and what data to give to the footer template. The function
   * must return `null` if a footer cell shouldn't be created.
   */
  footerFn?: HeaderFn;

  /**
   * The data that builds the templates within the virtual scroll.
   * It's important to note that when this data has changed, then the
   * entire virtual scroll is reset, which is an expensive operation and
   * should be avoided if possible.
   */
  items?: any[];

  /**
   * An optional function that maps each item within their height.
   * When this function is provides, heavy optimizations and fast path can be taked by
   * `ion-virtual-scroll` leading to massive performance improvements.
   *
   * This function allows to skip all DOM reads, which can be Doing so leads
   * to massive performance
   */
  itemHeight?: ItemHeightFn;

  /**
   * Same as `ngForTrackBy` which can be used on `ngFor`.
   */
  trackBy: TrackByFunction<any>;

  /**
   * This method marks the tail the items array as dirty, so they can be re-rendered.  It's equivalent to calling:  ```js    * virtualScroll.checkRange(lastItemLen, items.length - lastItemLen);    * ```
   */
  'checkEnd': () => void;
  /**
   * This method marks a subset of items as dirty, so they can be re-rendered. Items should be marked as dirty any time the content or their style changes.  The subset of items to be updated can are specifing by an offset and a length.
   */
  'checkRange': (offset: number, len?: number) => void;
  /**
   * Returns the position of the virtual item at the given index.
   */
  'positionForItem': (index: number) => Promise<number>;
}

@Component({
  selector: 'ion-virtual-scroll',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: [
    'approxItemHeight',
    'approxHeaderHeight',
    'approxFooterHeight',
    'headerFn',
    'footerFn',
    'items',
    'itemHeight',
    'trackBy'
  ]
})
export class IonVirtualScroll {

  private differ?: IterableDiffer<any>;
  private el: HTMLIonVirtualScrollElement;
  private refMap = new WeakMap<HTMLElement, EmbeddedViewRef<VirtualContext>> ();

  @ContentChild(VirtualItem) itmTmp!: VirtualItem;
  @ContentChild(VirtualHeader) hdrTmp!: VirtualHeader;
  @ContentChild(VirtualFooter) ftrTmp!: VirtualFooter;

  constructor(
    private z: NgZone,
    private iterableDiffers: IterableDiffers,
    elementRef: ElementRef,
  ) {
    this.el = elementRef.nativeElement as HTMLIonVirtualScrollElement;
    this.el.nodeRender = this.nodeRender.bind(this);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.trackBy && 'items' in changes) {
      // React on virtualScroll changes only once all inputs have been initialized
      const value = changes['items'].currentValue;
      if (this.differ === undefined && value != null) {
        try {
          this.differ = this.iterableDiffers.find(value).create(this.trackBy);
        } catch (e) {
          throw new Error(
            `Cannot find a differ supporting object '${value}'. VirtualScroll only supports binding to Iterables such as Arrays.`);
        }
      }
    }
  }

  ngDoCheck() {
    // and if there actually are changes
    const changes = this.differ !== undefined && this.items ? this.differ.diff(this.items) : null;
    if (changes === null) {
      return;
    }
    // TODO: optimize
    this.checkRange(0);
  }

  private nodeRender(el: HTMLElement | null, cell: Cell, index: number): HTMLElement {
    return this.z.run(() => {
      let node: EmbeddedViewRef<VirtualContext>;
      if (!el) {
        node = this.itmTmp.viewContainer.createEmbeddedView(
          this.getComponent(cell.type),
          { $implicit: cell.value, index },
          index
        );
        el = getElement(node);
        this.refMap.set(el, node);
      } else {
        node = this.refMap.get(el)!;
        const ctx = node.context;
        ctx.$implicit = cell.value;
        ctx.index = cell.index;
      }
      // run sync change detections
      node.detectChanges();
      return el;
    });
  }

  private getComponent(type: CellType) {
    switch (type) {
      case 'item': return this.itmTmp.templateRef;
      case 'header': return this.hdrTmp.templateRef;
      case 'footer': return this.ftrTmp.templateRef;
    }
    throw new Error('template for virtual item was not provided');
  }
}

function getElement(view: EmbeddedViewRef<VirtualContext>): HTMLElement {
  const rootNodes = view.rootNodes;
  for (let i = 0; i < rootNodes.length; i++) {
    if (rootNodes[i].nodeType === 1) {
      return rootNodes[i];
    }
  }
  throw new Error('virtual element was not created');
}

proxyInputs(IonVirtualScroll, [
  'approxItemHeight',
  'approxHeaderHeight',
  'approxFooterHeight',
  'headerFn',
  'footerFn',
  'items',
  'itemHeight'
]);

proxyMethods(IonVirtualScroll, [
  'checkEnd',
  'checkRange',
  'positionForItem'
]);
