import { ContentChildren, Directive, ElementRef, EventEmitter, Input, NgZone, Output, Renderer, forwardRef } from '@angular/core';
import { Ion } from '../ion';
import { isTrueProperty } from '../../util/util';
import { Config } from '../../config/config';
import { Platform } from '../../platform/platform';
const /** @type {?} */ QUERY = {
    xs: '(min-width: 0px)',
    sm: '(min-width: 576px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 992px)',
    xl: '(min-width: 1200px)',
    never: ''
};
/**
 * @hidden
 * @abstract
 */
export class RootNode {
    /**
     * @abstract
     * @return {?}
     */
    getElementRef() { }
    /**
     * @abstract
     * @return {?}
     */
    initPane() { }
    /**
     * @abstract
     * @param {?} visible
     * @return {?}
     */
    paneChanged(visible) { }
}
/**
 * \@name SplitPane
 *
 * \@description
 * SplitPane is a component that makes it possible to create multi-view layout.
 * Similar to iPad apps, SplitPane allows UI elements, like Menus, to be
 * displayed as the viewport increases.
 *
 * If the devices screen size is below a certain size, the SplitPane will
 * collapse and the menu will become hidden again. This is especially useful when
 * creating an app that will be served over a browser or deployed through the app
 * store to phones and tablets.
 *
 * \@usage
 * To use SplitPane, simply add the component around your root component.
 * In this example, we'll be using a sidemenu layout, similar to what is
 * provided from the sidemenu starter template.
 *
 *  ```html
 *  <ion-split-pane>
 *    <!--  our side menu  -->
 *    <ion-menu [content]="content">
 *      <ion-header>
 *        <ion-toolbar>
 *          <ion-title>Menu</ion-title>
 *        </ion-toolbar>
 *      </ion-header>
 *    </ion-menu>
 *
 *    <!-- the main content -->
 *    <ion-nav [root]="root" main #content></ion-nav>
 *  </ion-split-pane>
 *  ```
 *
 *  Here, SplitPane will look for the element with the `main` attribute and make
 *  that the central component on larger screens. The `main` component can be any
 *  Ionic component (`ion-nav` or `ion-tabs`) except `ion-menu`.
 *
 *  ### Setting breakpoints
 *
 *  By default, SplitPane will expand when the screen is larger than 768px.
 *  If you want to customize this, use the `when` input. The `when` input can
 *  accept any valid media query, as it uses `matchMedia()` underneath.
 *
 *  ```
 *  <ion-split-pane when="(min-width: 475px)">
 *
 *    <!--  our side menu  -->
 *    <ion-menu [content]="content">
 *    ....
 *    </ion-menu>
 *
 *    <!-- the main content -->
 *    <ion-nav [root]="root" main #content></ion-nav>
 *  </ion-split-pane>
 *  ```
 *
 *  SplitPane also provides some predefined media queries that can be used.
 *
 *  ```html
 *  <!-- could be "xs", "sm", "md", "lg", or "xl" -->
 *  <ion-split-pane when="lg">
 *  ...
 *  </ion-split-pane>
 *  ```
 *
 *
 *  | Size | Value                 | Description                                                           |
 *  |------|-----------------------|-----------------------------------------------------------------------|
 *  | `xs` | `(min-width: 0px)`    | Show the split-pane when the min-width is 0px (meaning, always)       |
 *  | `sm` | `(min-width: 576px)`  | Show the split-pane when the min-width is 576px                       |
 *  | `md` | `(min-width: 768px)`  | Show the split-pane when the min-width is 768px (default break point) |
 *  | `lg` | `(min-width: 992px)`  | Show the split-pane when the min-width is 992px                       |
 *  | `xl` | `(min-width: 1200px)` | Show the split-pane when the min-width is 1200px                      |
 *
 *  You can also pass in boolean values that will trigger SplitPane when the value
 *  or expression evaluates to true.
 *
 *
 *  ```html
 *  <ion-split-pane [when]="isLarge">
 *  ...
 *  </ion-split-pane>
 *  ```
 *
 *  ```ts
 *  class MyClass {
 *    public isLarge = false;
 *    constructor(){}
 *  }
 *  ```
 *
 *  Or
 *
 *  ```html
 *  <ion-split-pane [when]="shouldShow()">
 *  ...
 *  </ion-split-pane>
 *  ```
 *
 *  ```ts
 *  class MyClass {
 *    constructor(){}
 *    shouldShow(){
 *      if(conditionA){
 *        return true
 *      } else {
 *        return false
 *      }
 *    }
 *  }
 *  ```
 *
 */
export class SplitPane extends Ion {
    /**
     * @param {?} _zone
     * @param {?} _plt
     * @param {?} config
     * @param {?} elementRef
     * @param {?} renderer
     */
    constructor(_zone, _plt, config, elementRef, renderer) {
        super(config, elementRef, renderer, 'split-pane');
        this._zone = _zone;
        this._plt = _plt;
        this._init = false;
        this._visible = false;
        this._isEnabled = true;
        this._mediaQuery = QUERY['md'];
        /**
         * @hidden
         */
        this.sideContent = null;
        /**
         * @hidden
         */
        this.mainContent = null;
        /**
         * \@output {any} Expression to be called when the split-pane visibility has changed
         */
        this.ionChange = new EventEmitter();
    }
    /**
     * @hidden
     * @param {?} query
     * @return {?}
     */
    set _setchildren(query) {
        const /** @type {?} */ children = this._children = query.filter((child => child !== this));
        children.forEach(child => {
            var /** @type {?} */ isMain = child.initPane();
            this._setPaneCSSClass(child.getElementRef(), isMain);
        });
    }
    /**
     * \@input {string | boolean} When the split-pane should be shown.
     * Can be a CSS media query expression, or a shortcut expression.
     * Can also be a boolean expression.
     * @param {?} query
     * @return {?}
     */
    set when(query) {
        if (typeof query === 'boolean') {
            this._mediaQuery = query;
        }
        else {
            const /** @type {?} */ defaultQuery = QUERY[query];
            this._mediaQuery = (defaultQuery)
                ? defaultQuery
                : query;
        }
        this._update();
    }
    /**
     * @return {?}
     */
    get when() {
        return this._mediaQuery;
    }
    /**
     * \@input {boolean} If `false`, the split-pane is disabled, ie. the side pane will
     * never be displayed. Default `true`.
     * @param {?} val
     * @return {?}
     */
    set enabled(val) {
        this._isEnabled = isTrueProperty(val);
        this._update();
    }
    /**
     * @return {?}
     */
    get enabled() {
        return this._isEnabled;
    }
    /**
     * @hidden
     * @param {?} node
     * @param {?} isMain
     * @param {?} callback
     * @return {?}
     */
    _register(node, isMain, callback) {
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
    /**
     * @hidden
     * @return {?}
     */
    ngAfterViewInit() {
        this._init = true;
        this._update();
    }
    /**
     * @hidden
     * @return {?}
     */
    _update() {
        if (!this._init) {
            return;
        }
        // Unlisten
        this._rmListener && this._rmListener();
        this._rmListener = null;
        // Check if the split-pane is disabled
        if (!this._isEnabled) {
            this._setVisible(false);
            return;
        }
        const /** @type {?} */ query = this._mediaQuery;
        if (typeof query === 'boolean') {
            this._setVisible(query);
            return;
        }
        if (query && query.length > 0) {
            // Listen
            const /** @type {?} */ callback = (query) => this._setVisible(query.matches);
            const /** @type {?} */ mediaList = this._plt.win().matchMedia(query);
            mediaList.addListener(callback);
            this._setVisible(mediaList.matches);
            this._rmListener = function () {
                mediaList.removeListener(callback);
            };
        }
        else {
            this._setVisible(false);
        }
    }
    /**
     * @hidden
     * @return {?}
     */
    _updateChildren() {
        this.mainContent = null;
        this.sideContent = null;
        const /** @type {?} */ visible = this._visible;
        this._children.forEach(child => child.paneChanged && child.paneChanged(visible));
    }
    /**
     * @hidden
     * @param {?} visible
     * @return {?}
     */
    _setVisible(visible) {
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
    /**
     * @hidden
     * @return {?}
     */
    isVisible() {
        return this._visible;
    }
    /**
     * @hidden
     * @param {?} className
     * @param {?} add
     * @return {?}
     */
    setElementClass(className, add) {
        this._renderer.setElementClass(this._elementRef.nativeElement, className, add);
    }
    /**
     * @hidden
     * @param {?} elementRef
     * @param {?} isMain
     * @return {?}
     */
    _setPaneCSSClass(elementRef, isMain) {
        const /** @type {?} */ ele = elementRef.nativeElement;
        this._renderer.setElementClass(ele, 'split-pane-main', isMain);
        this._renderer.setElementClass(ele, 'split-pane-side', !isMain);
    }
    /**
     * @hidden
     * @return {?}
     */
    ngOnDestroy() {
        (void 0) /* assert */;
        this._rmListener && this._rmListener();
        this._rmListener = null;
    }
    /**
     * @hidden
     * @return {?}
     */
    initPane() {
        return true;
    }
}
SplitPane.decorators = [
    { type: Directive, args: [{
                selector: 'ion-split-pane',
                providers: [{ provide: RootNode, useExisting: forwardRef(() => SplitPane) }]
            },] },
];
/**
 * @nocollapse
 */
SplitPane.ctorParameters = () => [
    { type: NgZone, },
    { type: Platform, },
    { type: Config, },
    { type: ElementRef, },
    { type: Renderer, },
];
SplitPane.propDecorators = {
    '_setchildren': [{ type: ContentChildren, args: [RootNode, { descendants: false },] },],
    'when': [{ type: Input },],
    'enabled': [{ type: Input },],
    'ionChange': [{ type: Output },],
};
function SplitPane_tsickle_Closure_declarations() {
    /** @type {?} */
    SplitPane.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    SplitPane.ctorParameters;
    /** @type {?} */
    SplitPane.propDecorators;
    /** @type {?} */
    SplitPane.prototype._init;
    /** @type {?} */
    SplitPane.prototype._visible;
    /** @type {?} */
    SplitPane.prototype._isEnabled;
    /** @type {?} */
    SplitPane.prototype._rmListener;
    /** @type {?} */
    SplitPane.prototype._mediaQuery;
    /** @type {?} */
    SplitPane.prototype._children;
    /**
     * @hidden
     * @type {?}
     */
    SplitPane.prototype.sideContent;
    /**
     * @hidden
     * @type {?}
     */
    SplitPane.prototype.mainContent;
    /**
     * \@output {any} Expression to be called when the split-pane visibility has changed
     * @type {?}
     */
    SplitPane.prototype.ionChange;
    /** @type {?} */
    SplitPane.prototype._zone;
    /** @type {?} */
    SplitPane.prototype._plt;
}
//# sourceMappingURL=split-pane.js.map