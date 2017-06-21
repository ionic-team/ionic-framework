import { AfterContentInit, ContentChildren, Directive, ElementRef, Optional, QueryList, Renderer } from '@angular/core';
import { NgControl } from '@angular/forms';

import { Config } from '../../config/config';
import { BaseInput } from '../../util/base-input';
import { assert } from '../../util/util';
import { SegmentButton } from './segment-button';

/**
 * @name Segment
 * @description
 * A Segment is a group of buttons, sometimes known as Segmented Controls, that allow the user to interact with a compact group of a number of controls.
 * Segments provide functionality similar to tabs, selecting one will unselect all others. You should use a tab bar instead of a segmented control when you want to let the user move back and forth between distinct pages in your app.
 * You could use Angular's `ngModel` or `FormBuilder` API. For an overview on how `FormBuilder` works, checkout [Angular Forms](http://learnangular2.com/forms/), or [Angular FormBuilder](https://angular.io/docs/ts/latest/api/forms/index/FormBuilder-class.html)
 *
 *
 * ```html
 * <!-- Segment in a header -->
 * <ion-header>
 *   <ion-toolbar>
 *     <ion-segment [(ngModel)]="icons" color="secondary">
 *       <ion-segment-button value="camera">
 *         <ion-icon name="camera"></ion-icon>
 *       </ion-segment-button>
 *       <ion-segment-button value="bookmark">
 *         <ion-icon name="bookmark"></ion-icon>
 *       </ion-segment-button>
 *     </ion-segment>
 *   </ion-toolbar>
 * </ion-header>
 *
 * <ion-content>
 *   <!-- Segment in content -->
 *   <ion-segment [(ngModel)]="relationship" color="primary" (ionChange)="segmentChanged($event)">
 *     <ion-segment-button value="friends">
 *       Friends
 *     </ion-segment-button>
 *     <ion-segment-button value="enemies">
 *       Enemies
 *     </ion-segment-button>
 *   </ion-segment>
 *
 *   <!-- Segment in a form -->
 *   <form [formGroup]="myForm">
 *     <ion-segment formControlName="mapStyle" color="danger">
 *       <ion-segment-button value="standard">
 *         Standard
 *       </ion-segment-button>
 *       <ion-segment-button value="hybrid">
 *         Hybrid
 *       </ion-segment-button>
 *       <ion-segment-button value="sat">
 *         Satellite
 *       </ion-segment-button>
 *     </ion-segment>
 *   </form>
 * </ion-content>
 * ```
 *
 *
 * @demo /docs/demos/src/segment/
 * @see {@link /docs/components#segment Segment Component Docs}
 * @see [Angular Forms](http://learnangular2.com/forms/)
 */
@Directive({
  selector: 'ion-segment',
  host: {
    '[class.segment-disabled]': '_disabled'
  }
})
export class Segment extends BaseInput<string> implements AfterContentInit {

  /**
   * @hidden
   */
  @ContentChildren(SegmentButton) _buttons: QueryList<SegmentButton>;

  constructor(
    config: Config,
    elementRef: ElementRef,
    renderer: Renderer,
    @Optional() ngControl: NgControl
  ) {
    super(config, elementRef, renderer, 'segment', null, null, null, ngControl);
  }

  /**
   * @hidden
   */
  ngAfterContentInit() {
    this._initialize();
    this._buttons.forEach(button => {
      button.ionSelect.subscribe((selectedButton: any) => this.value = selectedButton.value);
    });
  }

  /**
   * @hidden
   * Write a new value to the element.
   */
  _inputUpdated() {
    if (!this._buttons) {
      assert(false, 'buttons are undefined');
      return;
    }
    const buttons = this._buttons.toArray();
    const value = this.value;
    for (var button of buttons) {
      button.isActive = (button.value === value);
    }
  }


}
