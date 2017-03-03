import { ContentChildren, Directive, ElementRef, EventEmitter, forwardRef, Input, Output, QueryList, NgZone, Renderer } from '@angular/core';
import { Ion } from '../ion';
import { assert } from '../../util/util';
import { Config } from '../../config/config';
import { Platform } from '../../platform/platform';

const QUERY: { [key: string]: string }  = {
  xs: '(min-width: 0px)',
  sm: '(min-width: 576px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 992px)',
  xl: '(min-width: 1200px)',
  never: ''
};

/**
 * @private
 */
export abstract class RootNode {
  abstract getElementRef(): ElementRef;
  abstract initPane(): boolean;
  abstract paneChanged?(visible: boolean): void;
}

/**
 * @name SplitPane
 */
@Directive({
  selector: 'ion-split-pane',
  providers: [{provide: RootNode, useExisting: forwardRef(() => SplitPane) }]
})
export class SplitPane extends Ion implements RootNode {

  _rmListener: any;
  _visible: boolean = false;
  _init: boolean = false;
  _mediaQuery: string | boolean = QUERY['md'];
  _children: RootNode[];

  sideContent: RootNode = null;
  mainContent: RootNode = null;

  @ContentChildren(RootNode, { descendants: false })
  set _setchildren(query: QueryList<RootNode>) {
    const children = this._children = query.filter((child => child !== this));
    children.forEach(child => {
      var isMain = child.initPane();
      this._setPaneCSSClass(child.getElementRef(), isMain);
    });
  }

  @Input()
  set when(query: string | boolean) {
    if (typeof query === 'boolean') {
      this._mediaQuery = query;
    } else {
      const defaultQuery = QUERY[query];
      this._mediaQuery = (defaultQuery)
        ? defaultQuery
        : query;
    }
    this._update();
  }
  get when(): string | boolean {
    return this._mediaQuery;
  }

  @Output() ionChange: EventEmitter<SplitPane> = new EventEmitter<SplitPane>();

  constructor(
    private _zone: NgZone,
    private _plt: Platform,
    config: Config,
    elementRef: ElementRef,
    renderer: Renderer,
  ) {
    super(config, elementRef, renderer, 'split-pane');
  }

  _register(node: RootNode, isMain: boolean, callback: Function): boolean {
    if (this.getElementRef().nativeElement !== node.getElementRef().nativeElement.parentNode) {
      return false;
    }
    this._setPaneCSSClass(node.getElementRef(), isMain);
    if (callback) {
      this.ionChange.subscribe(callback);
    }
    if (isMain) {
      if (this.mainContent) {
        console.error('split pane: main content was already set');
      }
      this.mainContent = node;
    }
    return true;
  }

  ngAfterViewInit() {
    this._init = true;
    this._update();
  }

  _update() {
    if (!this._init) {
      return;
    }
    // Unlisten
    this._rmListener && this._rmListener();
    this._rmListener = null;

    const query = this._mediaQuery;
    if (typeof query === 'boolean') {
      this._setVisible(query);
      return;
    }
    if (query && query.length > 0) {
      // Listen
      const callback = (query: MediaQueryList) => this._setVisible(query.matches);
      const mediaList = this._plt.win().matchMedia(query);
      mediaList.addListener(callback);
      this._setVisible(mediaList.matches);
      this._rmListener = function () {
        mediaList.removeListener(callback);
      };
    } else {
      this._setVisible(false);
    }
  }

  _updateChildren() {
    this.mainContent = null;
    this.sideContent = null;
    const visible = this._visible;
    this._children.forEach(child => child.paneChanged && child.paneChanged(visible));
  }

  _setVisible(visible: boolean) {
    if (this._visible === visible) {
      return;
    }
    this._visible = visible;
    this.setElementClass('split-pane-visible', visible);
    this._updateChildren();
    this._zone.run(() => {
      this.ionChange.emit(this);
    });
  }

  isVisible(): boolean {
    return this._visible;
  }

  setElementClass(className: string, add: boolean) {
    this._renderer.setElementClass(this._elementRef.nativeElement, className, add);
  }

  _setPaneCSSClass(elementRef: ElementRef, isMain: boolean) {
    const ele = elementRef.nativeElement;
    this._renderer.setElementClass(ele, 'split-pane-main', isMain);
    this._renderer.setElementClass(ele, 'split-pane-side', !isMain);
  }

  ngOnDestroy() {
    assert(this._rmListener, 'at this point _rmListerner should be valid');

    this._rmListener && this._rmListener();
    this._rmListener = null;
  }

  initPane(): boolean {
    return true;
  }

}
