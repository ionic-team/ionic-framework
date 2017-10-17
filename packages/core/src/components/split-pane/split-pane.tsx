import { Component, Element, Event, EventEmitter, Method, Prop, PropDidChange, State } from '@stencil/core';
// import { assert } from '../../utils/helpers';

const SPLIT_PANE_MAIN = 'split-pane-main';
const SPLIT_PANE_SIDE = 'split-pane-side';
const QUERY: { [key: string]: string }  = {
  'xs': '(min-width: 0px)',
  'sm': '(min-width: 576px)',
  'md': '(min-width: 768px)',
  'lg': '(min-width: 992px)',
  'xl': '(min-width: 1200px)',
  'never': ''
};


/**
 * @name SplitPane
 *
 * @description
 * SplitPane is a component that makes it possible to create multi-view layout.
 * Similar to iPad apps, SplitPane allows UI elements, like Menus, to be
 * displayed as the viewport increases.
 *
 * If the devices screen size is below a certain size, the SplitPane will
 * collapse and the menu will become hidden again. This is especially useful when
 * creating an app that will be served over a browser or deployed through the app
 * store to phones and tablets.
 *
 * @usage
 * To use SplitPane, simply add the component around your root component.
 * In this example, we'll be using a sidemenu layout, similar to what is
 * provided from the sidemenu starter template.
 *
 *  ```html
 *  <ion-split-pane>
 *    <!--  our side menu  -->
 *    <ion-menu>
 *      <ion-header>
 *        <ion-toolbar>
 *          <ion-title>Menu</ion-title>
 *        </ion-toolbar>
 *      </ion-header>
 *    </ion-menu>
 *
 *    <!-- the main content -->
 *    <ion-nav [root]="root" main></ion-nav>
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
 *    <ion-menu>
 *    ....
 *    </ion-menu>
 *
 *    <!-- the main content -->
 *    <ion-nav [root]="root" main></ion-nav>
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
@Component({
  tag: 'ion-split-pane',
  styleUrls: {
    ios: 'split-pane.ios.scss',
    md: 'split-pane.md.scss',
    wp: 'split-pane.wp.scss'
  },
  host: {
    theme: 'split-pane'
  }
})
export class SplitPane {

  private rmL: any;
  @Element() private ele: HTMLElement;
  @State() private visible: boolean = false;

  /**
   * @input {boolean} If `false`, the split-pane is disabled, ie. the side pane will
   * never be displayed. Default `true`.
   */
  @Prop() enabled: boolean = true;

  /**
   * @input {string | boolean} When the split-pane should be shown.
   * Can be a CSS media query expression, or a shortcut expression.
   * Can also be a boolean expression.
   */
  @Prop() when: string | boolean = QUERY['md'];

  /**
   * @output {any} Expression to be called when the split-pane visibility has changed
   */
  @Event() ionSplitPaneDidChange: EventEmitter;
  @Event() ionChange: EventEmitter;

  protected ionViewDidLoad() {
    this._styleChildren();
    this._updateQuery();
  }

  protected ionViewDidUnload() {
    this.rmL && this.rmL();
    this.rmL = null;
  }

  private _styleChildren() {
    const children = this.ele.children;
    const nu = this.ele.childElementCount;
    let foundMain = false;
    for (var i = 0; i < nu; i++) {
      var child = children[i] as HTMLElement;
      var isMain = child.hasAttribute('main');
      if (isMain) {
        if (foundMain) {
          console.warn('split pane can not have more than one main node');
          return;
        }
        foundMain = true;
      }
      setPaneClass(child, isMain);
    }
    if (!foundMain) {
      console.warn('split pane could not found any main node');
    }
  }

  @PropDidChange('when')
  _updateQuery() {
    this.rmL && this.rmL();
    this.rmL = null;

    // Check if the split-pane is disabled
    if (!this.enabled) {
      this._setVisible(false);
      return;
    }

    // When query is a boolean
    const query = this.when;
    if (typeof query === 'boolean') {
      this._setVisible(query);
      return;
    }

    // When query is a string, let's find first if it is a shortcut
    const defaultQuery = QUERY[query];
    const mediaQuery = (defaultQuery)
      ? defaultQuery
      : query;

    // Media query is empty or null, we hide it
    if (!mediaQuery || mediaQuery.length === 0) {
      this._setVisible(false);
      return;
    }

    // Listen on media query
    const callback = (q: MediaQueryList) => this._setVisible(q.matches);
    const mediaList = window.matchMedia(mediaQuery);
    mediaList.addListener(callback);
    this.rmL = () => mediaList.removeListener(callback);
    this._setVisible(mediaList.matches);
  }

  private _setVisible(visible: boolean) {
    if (this.visible !== visible) {
      this.visible = visible;
      const detail = { splitPane: this };
      this.ionChange.emit(detail);
      this.ionSplitPaneDidChange.emit(detail);
    }
  }

  /**
   * @hidden
   */
  @Method()
  isVisible(): boolean {
    return this.visible;
  }

  isPane(element: HTMLElement): boolean {
    if (!this.visible) {
      return false;
    }
    return element.parentElement === this.ele
      && element.classList.contains(SPLIT_PANE_SIDE);
  }

  hostData() {
    return {
      class: {
        'split-pane-visible': this.visible
      }
    };
  }

  protected render() {
    return <slot></slot>;
  }

}

export interface SplitPaneAlert {
  detail: {
    splitPane: SplitPane
  };
}

function setPaneClass(ele: HTMLElement, isMain: boolean) {
  let toAdd;
  let toRemove;
  if (isMain) {
    toAdd = SPLIT_PANE_MAIN;
    toRemove = SPLIT_PANE_SIDE;
  } else {
    toAdd = SPLIT_PANE_SIDE;
    toRemove = SPLIT_PANE_MAIN;
  }
  const classList = ele.classList;
  classList.add(toAdd);
  classList.remove(toRemove);
}
