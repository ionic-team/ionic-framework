import { ContentChildren, Component, ElementRef, EventEmitter, forwardRef, Input, QueryList, NgZone, Renderer } from '@angular/core';
import { Ion } from '../ion';
import { assert } from '../../util/util';
import { Config } from '../../config/config';
import { Platform } from '../../platform/platform';
import { RootNode } from '../../navigation/root-node';

const QUERY: { [key: string]: string }  = {
  xs: '(min-width: 0px)',
  sm: '(min-width: 576px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 992px)',
  xl: '(min-width: 1200px)',
  never: ''
};

/**
 * @name SplitPanel
 */
@Component({
  selector: 'ion-split-panel',
  template: '<ng-content></ng-content>',
  providers: [{provide: RootNode, useExisting: forwardRef(() => SplitPanel) }]
})
export class SplitPanel extends Ion implements RootNode {

  _rmListerner: any;
  _visible: boolean = false;
  _init: boolean = false;
  _mediaQuery: string|boolean = QUERY['md'];

  sideContent: RootNode;
  mainContent: RootNode;

  @ContentChildren(RootNode, {descendants: false})
  set _setChildren(query: QueryList<RootNode>) {
    this.mainContent = null;
    this.sideContent = null;

    if (query.length === 1) {
      var node = query.first;
      this.setPanelCSSClass(node.getElementRef(), false);
      this.mainContent = node;

    } else if (query.length >= 2) {
      query.forEach(child => {
        if (child !== this) {
          var isSide = child._isSideContent();
          if (isSide) {
            this.sideContent = child;
          } else {
            this.mainContent = child;
          }
          this.setPanelCSSClass(child.getElementRef(), isSide);
        }
      });
      if (!this.mainContent) {
        console.error('split panel: one of the elements needs the "main" attribute');
      }
      if (!this.sideContent) {
        console.error('split panel: missing side content node');
      }
      if (this.mainContent === this.sideContent) {
        console.error('split panel: main and side content are the same');
      }
    }
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

  ionChange: EventEmitter<SplitPanel> = new EventEmitter<SplitPanel>();

  constructor(
    private _zone: NgZone,
    private _plt: Platform,
    config: Config,
    elementRef: ElementRef,
    renderer: Renderer,
  ) {
    super(config, elementRef, renderer, 'split-panel');
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
    this._rmListerner && this._rmListerner();
    this._rmListerner = null;

    const query = this._mediaQuery;
    if (typeof query === 'boolean') {
      this.setVisible(query);
      return;
    }
    if (query && query.length > 0) {
      // Listen
      const callback = (query: MediaQueryList) => this.setVisible(query.matches);
      const mediaList = this._plt.win().matchMedia(query);
      mediaList.addListener(callback);
      this.setVisible(mediaList.matches);
      this._rmListerner = function () {
        mediaList.removeListener(callback);
      };
    } else {
      this.setVisible(false);
    }
  }

  setVisible(visible: boolean) {
    if (this._visible === visible) {
      return;
    }
    this.setElementClass('split-panel-visible', visible);

    this.sideContent && this.sideContent._setIsPanel(visible);
    this.mainContent && this.mainContent._setIsPanel(visible);

    this._visible = visible;

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

  setPanelCSSClass(elementRef: ElementRef, isSide: boolean) {
    const ele = elementRef.nativeElement;
    this._renderer.setElementClass(ele, 'split-panel-side', isSide);
    this._renderer.setElementClass(ele, 'split-panel-main', !isSide);
  }

  ngOnDestroy() {
    assert(this._rmListerner, 'at this point _rmListerner should be valid');

    this._rmListerner && this._rmListerner();
    this._rmListerner = null;
  }

  _setIsPanel(isPanel: boolean) {
    // Conforms to RootNode abstract class
  }

  _isSideContent(): boolean {
    return false;
  }

}
