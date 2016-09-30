import { Component, ContentChild, Input, ContentChildren, QueryList, ChangeDetectionStrategy, Directive, ElementRef, Renderer, ViewEncapsulation } from '@angular/core';

import { Config } from '../../config/config';
import { Ion } from '../ion';

import { UIEventManager } from '../../util/ui-event-manager';
import { isTrueProperty } from '../../util/util';

/**
  * @name FabButton
  * @module ionic
  *
  * @description
  * FABs (Floating Action Buttons) are standard material design components. They are shaped as a circle that represents a promoted action. When pressed, it may contain more related actions.
  * FABs as its name suggests are floating over the content in a fixed position. This is not achieved exclusively with `<button ion-fab>Button</button>` but it has to wrapped with the `<ion-fab>` component, like this:
  *
  * ```html
  * <ion-content>
  *  <!-- Real floating action button, fixed. It will not scroll with the content -->
  *  <ion-fab>
  *    <button ion-fab>Button</button>
  *  </ion-fab>
  *
  *  <!-- Button shaped as a circle that just like a normal button scrolls with the content -->
  *  <button ion-fab>Button</button>
  * </ion-content>
  *
  * ```
  *
  * In case the button is not wrapped with `<ion-fab>`, the fab button will behave like a normal button, scrolling with the content.
  *
  * See [ion-fab] to learn more information about how to position the fab button.
  *
  * @property [mini] - Makes a fab button with a reduced size.
  * @property [color] - Dynamically set which predefined color this button should use (e.g. primary, secondary, danger, etc).
  *
  * @usage
  *
  * ```html
  *
  * <!-- Colors -->
  * <ion-fab>
  *   <button ion-fab color="primary">Button</button>
  * </ion-fab>
  *
  * <!-- Mini -->
  * <ion-fab>
  *   <button ion-fab mini>Small</button>
  * </ion-fab>
  * ```
  *
  * @demo /docs/v2/demos/src/fab/
  * @see {@link /docs/v2/components#fabs FAB Component Docs}
 */
@Component({
  selector: '[ion-fab]',
  template:
  '<ion-icon name="close" class="fab-close-icon"></ion-icon>' +
  '<span class="button-inner">' +
    '<ng-content></ng-content>' +
  '</span>' +
  '<div class="button-effect"></div>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class FabButton extends Ion  {

  /**
   * @input {string} The predefined color to use. For example: `"primary"`, `"secondary"`, `"danger"`.
   */
  @Input()
  set color(val: string) {
    this._setColor('fab', val);
  }

  /**
   * @input {string} The mode to apply to this component.
   */
  @Input()
  set mode(val: string) {
    this._setMode('fab', val);
  }

  constructor(
    config: Config,
    elementRef: ElementRef,
    renderer: Renderer,
  ) {
    super(config, elementRef, renderer);
    this.setElementClass('fab', true); // set role
    this.mode = config.get('mode');
  }


  /**
   * @private
   */
  setActiveClose(closeVisible: boolean) {
    this.setElementClass('fab-close-active', closeVisible);
  }
}

/**
  * @name FabList
  * @description
  * `ion-fab-list` is a container for multiple FAB buttons. They are components of `ion-fab` and allow you to specificy the buttons position, left, right, top, bottom.
  * @usage
  *
  * ```html
  *  <ion-fab bottom right >
  *    <button ion-fab>Share</button>
  *    <ion-fab-list side="top">
  *      <button ion-fab>Facebook</button>
  *      <button ion-fab>Twitter</button>
  *      <button ion-fab>Youtube</button>
  *    </ion-fab-list>
  *    <ion-fab-list side="left">
  *      <button ion-fab>Vimeo</button>
  *    </ion-fab-list>
  *  </ion-fab>
  * ```
  * @module ionic
  *
  * @demo /docs/v2/demos/src/fab/
  * @see {@link /docs/v2/components#fab Fab Component Docs}
 */
@Directive({
  selector: 'ion-fab-list',
  host: {
    '[class.fab-list-active]': '_visible'
  }
})
export class FabList {
  _visible: boolean = false;
  _fabs: FabButton[] = [];

  @ContentChildren(FabButton)
  set _setbuttons(query: QueryList<FabButton>) {
    let fabs = this._fabs = query.toArray();
    for (var fab of fabs) {
      fab.setElementClass('fab-in-list', true);
    }
  }

  /**
   * @private
   */
  setVisible(val: boolean) {
    let visible = isTrueProperty(val);
    if (visible === this._visible) {
      return;
    }

    let fabs = this._fabs;
    let i = 1;
    if (visible) {
      fabs.forEach(fab => {
        setTimeout(() => fab.setElementClass('show', true), i * 30);
        i++;
      });
    } else {
      fabs.forEach(fab => fab.setElementClass('show', false));
    }
    this._visible = visible;
  }

}

/**
  * @name FabContainer
  * @module ionic
  *
  * @description
  * `<ion-fab>` is not a FAB button by itself but a container that assist the fab button (`<button ion-fab>`) allowing it
  * to be placed in fixed position that does not scroll with the content. It is also used to implement "material design speed dial",
  * ie. a FAB buttons displays a small lists of related actions when clicked.
  *
  * @property [top] - Places the container on the top of the content
  * @property [bottom] - Places the container on the bottom  of the content
  * @property [left] - Places the container on the left
  * @property [right] - Places the container on the right
  * @property [middle] - Places the container on the middle vertically
  * @property [center] - Places the container on the center horizontally
  * @property [edge] - Used to place the container between the content and the header/footer
  *
  * @usage
  *
  * ```html
  * <!-- this fab is placed at top right -->
  * <ion-content>
  *  <ion-fab top right>
  *    <button ion-fab>Button</button>
  *  </ion-fab>
  *
  *  <!-- this fab is placed at the center of the content viewport -->
  *  <ion-fab center middle>
  *    <button ion-fab>Button</button>
  *  </ion-fab>
  * </ion-content>
  * ```
  *
  * Ionic's FAB also supports "material design's fab speed dial". It is a normal fab button
  * that shows a list of related actions when clicked.
  *
  * The same `ion-fab` container can contain several `ion-fab-list` with different side values:
  * `top`, `bottom`, `left` and `right`. For example, if you want to have a list of button that are
  * on the top of the main button, you should use `side="top"` and so on. By default, if side is ommited, `side="bottom"`.
  *
  * ```html
  * <ion-content>
  *  <!-- this fab is placed at top right -->
  *  <ion-fab bottom right >
  *    <button ion-fab>Share</button>
  *    <ion-fab-list side="top">
  *      <button ion-fab>Facebook</button>
  *      <button ion-fab>Twitter</button>
  *      <button ion-fab>Youtube</button>
  *    </ion-fab-list>
  *    <ion-fab-list side="left">
  *      <button ion-fab>Vimeo</button>
  *    </ion-fab-list>
  *  </ion-fab>
  * </ion-content>
  * ```
  *
  * A FAB speed dial can also be closed programatically.
  *
  * ```html
  * <ion-content>
  *  <ion-fab bottom right #fab>
  *    <button ion-fab>Share</button>
  *    <ion-fab-list side="top">
  *      <button ion-fab (click)="share('facebook', fab)">Facebook</button>
  *      <button ion-fab (click)="share('twitter', fab)">Twitter</button>
  *    </ion-fab-list>
  *  </ion-fab>
  * </ion-content>
  * ```
  *
  * ```ts
  * share(socialNet: string, fab: FabContainer) {
  *   fab.close();
  *   console.log("Sharing in", socialNet);
  * }
  * ```
  *
  * @demo /docs/v2/demos/src/fab/
  * @see {@link /docs/v2/components#fabs FAB Component Docs}
 */
@Component({
  selector: 'ion-fab',
  template: '<ng-content></ng-content>'
})
export class FabContainer {

  /**
   * @private
   */
  _events: UIEventManager = new UIEventManager();

  /**
   * @private
   */
  _listsActive: boolean = false;

  /**
   * @private
   */
  @ContentChild(FabButton) _mainButton: FabButton;

  /**
   * @private
   */
  @ContentChildren(FabList) _fabLists: QueryList<FabList>;

  constructor(private _elementRef: ElementRef) { }

  /**
   * @private
   */
  ngAfterContentInit() {
    this._events.listen(this._mainButton.getNativeElement(), 'click', this.pointerUp.bind(this));
  }

  /**
   * @private
   */
  pointerUp(ev: any) {
    if (this.canActivateList(ev)) {
      this.toggleList();
    }
  }

  /**
   * @private
   */
  canActivateList(ev: any): boolean {
    if (this._fabLists.length > 0 && this._mainButton && ev.target) {
      let ele = ev.target.closest('ion-fab>button');
      return (ele && ele === this._mainButton.getNativeElement());
    }
    return false;
  }

  /**
   * @private
   */
  toggleList() {
    this.setActiveLists(!this._listsActive);
  }

  /**
   * @private
   */
  setActiveLists(isActive: boolean) {
    if (isActive === this._listsActive) {
      return;
    }
    let lists = this._fabLists.toArray();
    for (let list of lists) {
      list.setVisible(isActive);
    }
    this._mainButton.setActiveClose(isActive);
    this._listsActive = isActive;
  }

  /**
   * Close an active FAB list container
   */
  close() {
    this.setActiveLists(false);
  }

  /**
   * @private
   */
  ngOnDestroy() {
    this._events.unlistenAll();
  }
}
