import { Directive, ElementRef, Input } from '@angular/core';

import { GestureController } from '../../gestures/gesture-controller';
import { isTrueProperty } from '../../util/util';


/**
 * @private
 */
@Directive({
  selector: 'ion-backdrop',
  host: {
    'role': 'presentation',
    'tappable': '',
    'disable-activated': ''
  },
})
export class Backdrop {
  private _gestureID: number = null;
  @Input() disableScroll = true;

  constructor(private _gestureCtrl: GestureController, private _elementRef: ElementRef) {}

  ngOnInit() {
    if (isTrueProperty(this.disableScroll)) {
      this._gestureID = this._gestureCtrl.newID();
      this._gestureCtrl.disableScroll(this._gestureID);
    }
  }

  ngOnDestroy() {
    if (this._gestureID) {
      this._gestureCtrl.enableScroll(this._gestureID);
    }
  }

  getNativeElement(): HTMLElement {
    return this._elementRef.nativeElement;
  }

}
