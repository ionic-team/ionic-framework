import { Component, Event, EventEmitter, Prop, State } from '@stencil/core';

import { CssClassMap } from '../../index';
import { createThemedClasses } from '../../utils/theme';


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
  tag: 'ion-segment-button'
})
export class SegmentButton {
  styleTmr: any;

  mode: string;
  color: string;

  @Event() ionClick: EventEmitter;

  @State() activated: boolean = false;

  /*
   * @input {boolean} If true, the button is selected. Default false.
   */
  @Prop({ state: true }) checked: boolean = false;

  /*
   * @input {boolean} If true, the user cannot interact with this element. Default false.
   */
  @Prop({ state: true }) disabled: boolean = false;

  /**
   * @input {string} the value of the segment button. Required.
   */
  @Prop({ state: true }) value: string;

  segmentButtonClick(ev: UIEvent) {
    ev.preventDefault();
    ev.stopPropagation();

    console.log('in segment button click');
    this.emitClick();
  }

  /**
   * Emit the click event to the parent segment
   */
  private emitClick() {
    clearTimeout(this.styleTmr);

    this.styleTmr = setTimeout(() => {
      const ev: SegmentButtonEvent = {
        'segmentButton': this
      };
      this.ionClick.emit(ev);
    });
  }

  /**
   * @hidden
   * Get the element classes to add to the child element
   */
  getElementClassList() {
    let classList = [].concat(
      this.disabled ? 'segment-button-disabled' : [],
      this.activated ? 'segment-activated' : [],
    );

    return classList;
  }

  render() {
    const segmentButtonCss = createThemedClasses(this.mode, this.color, 'segment-button');

    var segmentButtonClasses: CssClassMap = []
      .concat(
        this.getElementClassList()
      )
      .reduce((prevValue, cssClass) => {
        prevValue[cssClass] = true;
        return prevValue;
      }, {});

    segmentButtonClasses = Object.assign(segmentButtonClasses, segmentButtonCss);

    return [
      <button onClick={this.segmentButtonClick.bind(this)} class={segmentButtonClasses} aria-pressed={this.activated}>
        <slot></slot>
      </button>
    ];
  }
}


export interface SegmentButtonEvent {
  segmentButton: SegmentButton;
}
