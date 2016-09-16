import { Component, ContentChild, Input, ContentChildren, QueryList, ChangeDetectionStrategy, Directive, ElementRef, Renderer, ViewEncapsulation } from '@angular/core';

import { Config } from '../../config/config';
import { Ion } from '../ion';

import { UIEventManager } from '../../util/ui-event-manager';
import { isTrueProperty } from '../../util/util';

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

  ngAfterContentInit() {
    this.setElementClass('fab-button', true); // set role
  }
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
    this.mode = config.get('mode');
  }


  setActiveClose(closeVisible: boolean) {
    this.setElementClass('fab-close-active', closeVisible);
  }
}

/**
  * @name Fab
  * @module ionic
  *
  * @demo /docs/v2/demos/fab/
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

  @ContentChildren(FabButton) _buttons: QueryList<FabButton>;

  /**
   * @private
   */
  setVisible(val: boolean) {
    let visible = isTrueProperty(val);
    if (visible === this._visible) {
      return;
    }

    let buttons = this._buttons.toArray();
    let i = 1;
    if (visible) {
      buttons.forEach(fab => {
        setTimeout(() => fab.setElementClass('fab-dial-button-visible', true), i * 30);
        i++;
      });
    } else {
      buttons.forEach(fab => fab.setElementClass('fab-dial-button-visible', false));
    }
    this._visible = visible;
  }

}

@Component({
  selector: 'ion-fab',
  template: '<ng-content></ng-content>'
})
export class Fab {
  _events: UIEventManager = new UIEventManager();
  _listsActive: boolean = false;

  @ContentChild(FabButton) _mainButton: FabButton;
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
