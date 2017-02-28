import { ContentChildren, Component, ElementRef, EventEmitter, forwardRef, Input, Output, QueryList, NgZone, Renderer } from '@angular/core';
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
 * @name SplitPane
 */
@Component({
  selector: 'ion-split-pane',
  template: '<ng-content></ng-content>',
  providers: [{provide: RootNode, useExisting: forwardRef(() => SplitPane) }]
})
export class SplitPane extends Ion implements RootNode {

  _rmListener: any;
  _visible: boolean = false;
  _init: boolean = false;
  _mediaQuery: string | boolean = QUERY['md'];

  sideContent: RootNode;
  mainContent: RootNode;

  @ContentChildren(RootNode, { descendants: false }) children: QueryList<RootNode>;

  updateChildren() {
    this.mainContent = null;
    this.sideContent = null;

    this.children.forEach(child => {
      if (child !== this) {
        var isSide = child._isSideContent();
        this.setPaneCSSClass(child.getElementRef(), isSide);
        if (child.enabled) {
          if (isSide) {
            if (this.sideContent) {
              console.error('split pane: side content was already set');
            }
            this.sideContent = child;
          } else {
            if (this.mainContent) {
              console.error('split pane: main content was already set');
            }
            this.mainContent = child;
          }
        }
        child._setIsPane(this._visible);
      }
    });
    if (!this.mainContent) {
      console.error('split pane: one of the elements needs the "main" attribute');
    }
    if (this.mainContent === this.sideContent) {
      console.error('split pane: main and side content are the same');
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
      this.setVisible(query);
      return;
    }
    if (query && query.length > 0) {
      // Listen
      const callback = (query: MediaQueryList) => this.setVisible(query.matches);
      const mediaList = this._plt.win().matchMedia(query);
      mediaList.addListener(callback);
      this.setVisible(mediaList.matches);
      this._rmListener = function () {
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
    this._visible = visible;
    this.setElementClass('split-pane-visible', visible);
    this.updateChildren();

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

  setPaneCSSClass(elementRef: ElementRef, isSide: boolean) {
    const ele = elementRef.nativeElement;
    this._renderer.setElementClass(ele, 'split-pane-side', isSide);
    this._renderer.setElementClass(ele, 'split-pane-main', !isSide);
  }

  ngOnDestroy() {
    assert(this._rmListener, 'at this point _rmListerner should be valid');

    this._rmListener && this._rmListener();
    this._rmListener = null;
  }

  _setIsPane(isPane: boolean) {
    // Conforms to RootNode abstract class
  }

  _isSideContent(): boolean {
    return false;
  }

  get enabled(): boolean {
    return true;
  }

}
