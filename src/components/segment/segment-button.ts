import { Component, EventEmitter, HostListener, Input, Output, ViewEncapsulation } from '@angular/core';

import { isPresent, isTrueProperty } from '../../util/util';

/**
 * @name SegmentButton
 * @description
 * The child buttons of the `ion-segment` component. Each `ion-segment-button` must have a value.
 *
 * @usage
 *
 * ```html
 * <ion-content>
 *   <!-- Segment buttons with icons -->
 *   <ion-segment [(ngModel)]="icons" color="secondary">
 *     <ion-segment-button value="camera">
 *       <ion-icon name="camera"></ion-icon>
 *     </ion-segment-button>
 *     <ion-segment-button value="bookmark">
 *       <ion-icon name="bookmark"></ion-icon>
 *     </ion-segment-button>
 *   </ion-segment>
 *
 *   <!-- Segment buttons with text -->
 *   <ion-segment [(ngModel)]="relationship" color="primary">
 *     <ion-segment-button value="friends" (ionSelect)="selectedFriends()">
 *       Friends
 *     </ion-segment-button>
 *     <ion-segment-button value="enemies" (ionSelect)="selectedEnemies()">
 *       Enemies
 *     </ion-segment-button>
 *   </ion-segment>
 * </ion-content>
 * ```
 *
 *
 * @demo /docs/demos/src/segment/
 * @see {@link /docs/components#segment Segment Component Docs}
 * @see {@link /docs/api/components/segment/Segment/ Segment API Docs}
 */
@Component({
  selector: 'ion-segment-button',
  template:
    '<ng-content></ng-content>' +
    '<div class="button-effect"></div>',
  host: {
    'tappable': '',
    'class': 'segment-button',
    'role': 'button',
    '[class.segment-button-disabled]': '_disabled',
    '[class.segment-activated]': 'isActive',
    '[attr.aria-pressed]': 'isActive'
  },
  encapsulation: ViewEncapsulation.None,
})
export class SegmentButton {

  isActive: boolean = false;
  _disabled: boolean = false;

  /**
   * @input {string} the value of the segment button. Required.
   */
  @Input() value: string;

  /**
   * @output {SegmentButton} Emitted when a segment button has been clicked.
   */
  @Output() ionSelect: EventEmitter<SegmentButton> = new EventEmitter<SegmentButton>();

  /**
   * @input {boolean} If true, the user cannot interact with this element.
   */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(val: boolean) {
    this._disabled = isTrueProperty(val);
  }

  constructor() {}

  /**
   * @hidden
   * On click of a SegmentButton
   */
  @HostListener('click')
  onClick() {
    console.debug('SegmentButton, select', this.value);
    this.ionSelect.emit(this);
  }

  /**
   * @hidden
   */
  ngOnInit() {
    if (!isPresent(this.value)) {
      console.warn('<ion-segment-button> requires a "value" attribute');
    }
  }

}
