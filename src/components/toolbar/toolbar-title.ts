import { Component, ElementRef, Optional, forwardRef, Inject, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

import { Ion } from '../ion';
import { Navbar } from '../navbar/navbar';
import { Toolbar } from './toolbar';


/**
 * @name Title
 * @description
 * `ion-title` is a component that sets the title of the `Toolbar` or `Navbar`
 *
 * @usage
 *
 * ```html
 * <ion-header>
 *
 *   <ion-navbar>
 *     <ion-title>Settings</ion-title>
 *   </ion-navbar>
 *
 * </ion-header>
 * ```
 *
 * Or to create a navbar with a toolbar as a subheader:
 *
 * ```html
 * <ion-header>
 *
 *   <ion-navbar>
 *     <ion-title>Main Heder</ion-title>
 *   </ion-navbar>
 *
 *   <ion-toolbar>
 *     <ion-title>Subheader</ion-title>
 *   </ion-toolbar>
 *
 * </ion-header>
 * ```
 *
 * @demo /docs/v2/demos/title/
 */
@Component({
  selector: 'ion-title',
  template:
    '<div class="toolbar-title">' +
      '<ng-content></ng-content>' +
    '</div>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ToolbarTitle extends Ion {
  constructor(
    private _elementRef: ElementRef,
    @Optional() toolbar: Toolbar,
    @Optional() @Inject(forwardRef(() => Navbar)) navbar: Navbar
  ) {
    super(_elementRef);
    toolbar && toolbar.setTitleCmp(this);
    navbar && navbar.setTitleCmp(this);
  }

  /**
   * @private
   */
  getTitleText() {
    return this._elementRef.nativeElement.textContent;
  }
}
