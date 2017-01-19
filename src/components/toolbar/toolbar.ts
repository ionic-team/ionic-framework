import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, Optional, Renderer } from '@angular/core';

import { Config } from '../../config/config';
import { Ion } from '../ion';
import { ToolbarTitle } from './toolbar-title';
import { ViewController } from '../../navigation/view-controller';


/**
 * @name Header
 * @description
 * Header is a parent component that holds the navbar and toolbar component.
 * It's important to note that `ion-header` needs to be the one of the three root elements of a page
 *
 * @usage
 *
 * ```html
 * <ion-header>
 *   <ion-navbar>
 *     <ion-title>Page1</ion-title>
 *   </ion-navbar>
 *
 *   <ion-toolbar>
 *     <ion-title>Subheader</ion-title>
 *   </ion-toolbar>
 * </ion-header>
 *
 * <ion-content></ion-content>
 * ```
 *
 * ### Box Shadow and Border
 * In `md` (Material Design) mode, the `<ion-header>` will receive a box-shadow on the bottom
 * In `ios` mode, the `<ion-header>` will receive a border on the bottom. Both the `md` box-shadow 
 * and the `ios` border can be removed by adding the `no-border` attribute to the element.
 *
 * @property [no-border] - Removes the default box-shadow or border from the header
 * @demo /docs/v2/demos/src/toolbar/basic
 * @additionalDemo segment-in-toolbars: /docs/v2/demos/src/toolbar/segment/
 * @additionalDemo searchbar-in-toolbars: /docs/v2/demos/src/toolbar/searchbar/
 * @see {@link ../Toolbar Toolbar API Docs}
 */
@Directive({
  selector: 'ion-header'
})
export class Header extends Ion {

  constructor(config: Config, elementRef: ElementRef, renderer: Renderer, @Optional() viewCtrl: ViewController) {
    super(config, elementRef, renderer, 'header');
    viewCtrl && viewCtrl._setHeader(this);
  }

}


/**
 * @name Footer
 * @description
 * Footer is a root component of a page that sits at the bottom of the page.
 * Footer can be a wrapper for `ion-toolbar` to make sure the content area is sized correctly.
 *
 * @usage
 *
 * ```html
 * <ion-content></ion-content>
 *
 * <ion-footer>
 *   <ion-toolbar>
 *     <ion-title>Footer</ion-title>
 *   </ion-toolbar>
 * </ion-footer>
 * ```
 *
 * ### Box Shadow and Border
 * In `md` (Material Design) mode, the `<ion-footer>` will receive a box-shadow on the top.  In `ios` mode, 
 * the `<ion-footer>` will receive a border on the top. Both the `md` box-shadow and the `ios` border can 
 * be removed by adding the `no-border` attribute to the element.
 *
 * @property [no-border] - Removes the default box-shadow or border from the footer
 *
 * @see {@link ../Toolbar Toolbar API Docs}
 *
 */
@Directive({
  selector: 'ion-footer'
})
export class Footer extends Ion {

  constructor(config: Config, elementRef: ElementRef, renderer: Renderer, @Optional() viewCtrl: ViewController) {
    super(config, elementRef, renderer, 'footer');
    viewCtrl && viewCtrl._setFooter(this);
  }

}


/**
 * @private
 */
export class ToolbarBase extends Ion {
  private _title: ToolbarTitle;

  constructor(config: Config, elementRef: ElementRef, renderer: Renderer) {
    super(config, elementRef, renderer, 'toolbar');
  }

  /**
   * @private
   */
  _setTitle(titleCmp: ToolbarTitle) {
    this._title = titleCmp;
  }

  /**
   * @private
   * Returns the toolbar title text if it exists or an empty string
   */
  getTitleText() {
    return (this._title && this._title.getTitleText()) || '';
  }

}

/**
 * @name Toolbar
 * @description
 * A Toolbar is a generic bar that is positioned above or below content.
 * Unlike a [Navbar](../../navbar/Navbar), a toolbar can be used as a subheader.
 * When toolbars are placed within an `<ion-header>` or `<ion-footer>`,
 * the toolbars stay fixed in their respective location. When placed within
 * `<ion-content>`, toolbars will scroll with the content.
 *
 * ### Buttons in a Toolbar
 * Buttons placed in a toolbar should be placed inside of the `<ion-buttons>`
 * element. An exception to this is a [menuToggle](../../menu/MenuToggle) button.
 * It should not be placed inside of the `<ion-buttons>` element. Both the
 * `<ion-buttons>` element and the `menuToggle` can be positioned inside of the
 * toolbar using different properties. The below chart has a description of each
 * property.
 *
 * 
 *
 * @usage
 *
 * ```html
 *
 * <ion-header no-border>
 *
 *   <ion-toolbar>
 *     <ion-title>My Toolbar Title</ion-title>
 *   </ion-toolbar>
 *
 *   <ion-toolbar>
 *     <ion-title>I'm a subheader</ion-title>
 *   </ion-toolbar>
 *
 * <ion-header>
 *
 *
 * <ion-content>
 *
 *   <ion-toolbar>
 *     <ion-title>Scrolls with the content</ion-title>
 *   </ion-toolbar>
 *
 * </ion-content>
 *
 *
 * <ion-footer no-border>
 *
 *   <ion-toolbar>
 *     <ion-title>I'm a footer</ion-title>
 *   </ion-toolbar>
 *
 * </ion-footer>
 *  ```
 *
 * ### Changing the Color
 * 
 * You can change the toolbars color by changing the property on the element.
 * 
 * ```typescript
 * 
 * @Component({
 *   template: `
 *     <ion-toolbar color="primary">
 *       <ion-title>Toolbar</ion-title>
 *     </ion-toolbar>
 * 
 * 
 *     <ion-toolbar color="secondary">
 *       <ion-title>Toolbar</ion-title>
 *     </ion-toolbar>
 * 
 *     <ion-toolbar color="danger">
 *       <ion-title>Toolbar</ion-title>
 *     </ion-toolbar>
 * 
 * 
 *     <ion-toolbar color="dark">
 *       <ion-title>Toolbar</ion-title>
 *     </ion-toolbar>
 *   `
 *   })
 * 
 * ```
 * 
 * You can also change the navbar's color the same way. This will allow you to have 
 * a different color navbar per page in your app.
 * 
 * ```html
 * <ion-header>
 *   <ion-navbar color="dark">
 *     <ion-title>Dark</ion-title>
 *   </ion-navbar>
 * </ion-header>
 * 
 * 
 * <ion-header>
 *   <ion-navbar color="danger">
 *     <ion-title>Danger</ion-title>
 *   </ion-navbar>
 * </ion-header>
 * 
 * <ion-header>
 *   <ion-navbar color="secondary">
 *     <ion-title>Secondary</ion-title>
 *   </ion-navbar>
 * </ion-header>
 * ```
 * 
 * ## Common Usage Patterns
 *
 * ### Header
 * 
 * One of the best uses of the toolbar is as a header.
 * 
 * ```html
 * <ion-header>
 *   <ion-toolbar color="primary">
 *     <ion-buttons start>
 *       <button ion-button icon-only>
 *         <ion-icon name="content"></ion-icon>
 *       </button>
 *     </ion-buttons>
 * 
 *     <ion-title>Header</ion-title>
 * 
 *     <ion-buttons end>
 *       <button ion-button icon-only>
 *         <ion-icon name="search"></ion-icon>
 *       </button>
 *     </ion-buttons>
 * 
 *   </ion-toolbar>
 * </ion-header>
 * 
 * <ion-content>
 *   <p>There is a header above me!</p>
 * </ion-content>
 * 
 * ```
 * 
 * ### Buttons in Toolbars
 * 
 * Buttons can be added to both header and footer toolbars. To add a button 
 * to a toolbar, we need to first add an `ion-buttons` component. This component 
 * wraps one or more buttons, and can be positioned using one of following attributes:
 *
 * | Property    | Description                                                                                                           |
 * |-------------|-----------------------------------------------------------------------------------------------------------------------|
 * | `start`     | Positions element to the left of the content in `ios` mode, and directly to the right in `md` and `wp` mode.    |
 * | `end`       | Positions element to the right of the content in `ios` mode, and to the far right in `md` and `wp` mode.        |
 * | `left`      | Positions element to the left of all other elements.                                                            |
 * | `right`     | Positions element to the right of all other elements. 
 * 
 * ```html
 * <ion-header>
 *   <ion-toolbar>
 *     <ion-buttons start>
 *       <button ion-button icon-only color="royal">
 *         <ion-icon name="search"></ion-icon>
 *       </button>
 *     </ion-buttons>
 *     <ion-title>Send To...</ion-title>
 *     <ion-buttons end>
 *       <button ion-button icon-only color="royal">
 *         <ion-icon name="person-add"></ion-icon>
 *       </button>
 *     </ion-buttons>
 *   </ion-toolbar>
 * </ion-header>
 * 
 * <ion-content></ion-content>
 * 
 * <ion-footer>
 *   <ion-toolbar>
 *     <p>Ash, Misty, Brock</p>
 *     <ion-buttons end>
 *       <button ion-button icon-right color="royal">
 *         Send
 *         <ion-icon name="send"></ion-icon>
 *       </button>
 *     </ion-buttons>
 *   </ion-toolbar>
 * </ion-footer>
 * ```
 * 
 * 
 * ### Segment in Toolbars
 * 
 * [Segments](#segment) are a great way to allow users to switch between different 
 * sets of data. Use the following markup to add a segment to a toolbar:
 * 
 * ```html
 * <ion-header>
 *   <ion-toolbar>
 *     <ion-buttons start>
 *       <button ion-button icon-only>
 *         <ion-icon name="create"></ion-icon>
 *       </button>
 *     </ion-buttons>
 *     <ion-segment>
 *       <ion-segment-button value="new">
 *         New
 *       </ion-segment-button>
 *       <ion-segment-button value="hot">
 *         Hot
 *       </ion-segment-button>
 *     </ion-segment>
 *     <ion-buttons end>
 *       <button ion-button icon-only>
 *         <ion-icon name="more"></ion-icon>
 *       </button>
 *     </ion-buttons>
 *   </ion-toolbar>
 * </ion-header>
 * ```
 * 
 * ### Searchbar in Toolbars
 * 
 * Another common design paradigm is to include a searchbar inside your toolbar.
 * 
 * ```html
 * <ion-header>
 *   <ion-toolbar color="primary">
 *     <ion-searchbar (input)="getItems($event)"></ion-searchbar>
 *   </ion-toolbar>
 * </ion-header>
 * 
 * <ion-content>
 *   <ion-list>
 *     <ion-item *ngFor="let item of items">
 *       {% raw %}{{ item }}{% endraw %}
 *     </ion-item>
 *   </ion-list>
 * </ion-content>
 * ```
 *
 * @demo /docs/v2/demos/src/toolbar/basic
 * @see {@link ../../navbar/Navbar/ Navbar API Docs}
 * @see {@link ../Header/ Header API Docs}
 * @see {@link ../Footer/ Footer API Docs}
 */
@Component({
  selector: 'ion-toolbar',
  template:
    '<div class="toolbar-background" [ngClass]="\'toolbar-background-\' + _mode"></div>' +
    '<ng-content select="[menuToggle],ion-buttons[left]"></ng-content>' +
    '<ng-content select="ion-buttons[start]"></ng-content>' +
    '<ng-content select="ion-buttons[end],ion-buttons[right]"></ng-content>' +
    '<div class="toolbar-content" [ngClass]="\'toolbar-content-\' + _mode">' +
      '<ng-content></ng-content>' +
    '</div>',
  host: {
    'class': 'toolbar',
    '[class.statusbar-padding]': '_sbPadding'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toolbar extends ToolbarBase {
  /** @private */
  _sbPadding: boolean;

  /**
   * @input {string} The predefined color to use. For example: `"primary"`, `"secondary"`, `"danger"`.
   */
  @Input()
  set color(val: string) {
    this._setColor(val);
  }

  /**
   * @input {string} The mode to apply to this component. Mode can be `ios`, `wp`, or `md`.
   */
  @Input()
  set mode(val: string) {
    this._setMode(val);
  }

  constructor(
    @Optional() viewCtrl: ViewController,
    config: Config,
    elementRef: ElementRef,
    renderer: Renderer
  ) {
    super(config, elementRef, renderer);
    this._sbPadding = config.getBoolean('statusbarPadding');
  }

}
