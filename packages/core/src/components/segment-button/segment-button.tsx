import { Component, Element, Event, EventEmitter, Prop, State } from '@stencil/core';

import { CssClassMap } from '../../index';
import { createThemedClasses, getElementClassObject } from '../../utils/theme';


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

  @Element() el: HTMLElement;

  @Event() ionClick: EventEmitter;

  @State() activated: boolean = false;

  /*
   * @input {boolean} If true, the button is selected. Default false.
   */
  @Prop({ mutable: true }) checked: boolean = false;

  /*
   * @input {boolean} If true, the user cannot interact with this element. Default false.
   */
  @Prop({ mutable: true }) disabled: boolean = false;

  /**
   * @input {string} the value of the segment button. Required.
   */
  @Prop({ mutable: true }) value: string;

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
   * Get the classes for the segment button state
   */
  getElementClassList() {
    let classList = [].concat(
      this.disabled ? 'segment-button-disabled' : [],
      this.activated ? 'segment-activated' : [],
    );

    return classList;
  }

  protected render() {
    const themedClasses = createThemedClasses(this.mode, this.color, 'segment-button');
    const hostClasses = getElementClassObject(this.el.classList);

    const elementClasses: CssClassMap = []
      .concat(
        this.getElementClassList()
      )
      .reduce((prevValue, cssClass) => {
        prevValue[cssClass] = true;
        return prevValue;
      }, {});

    const buttonClasses = {
      ...themedClasses,
      ...hostClasses,
      ...elementClasses
    };

    return [
      <button onClick={this.segmentButtonClick.bind(this)} class={buttonClasses} aria-pressed={this.activated}>
        <slot></slot>
      </button>
    ];
  }
}


export interface SegmentButtonEvent {
  segmentButton: SegmentButton;
}
