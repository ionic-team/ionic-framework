import { Component, Element, Event, EventEmitter, Prop, State } from '@stencil/core';
import { CssClassMap } from '../../index';
import { createThemedClasses, getElementClassObject } from '../../utils/theme';


@Component({
  tag: 'ion-segment-button'
})
export class SegmentButton {
  styleTmr: any;

  @Element() private el: HTMLElement;

  /**
   * @output {SegmentButtonEvent} Emitted when the segment button is clicked.
   */
  @Event() ionClick: EventEmitter<SegmentButtonEventDetail>;

  @State() activated: boolean = false;

  /**
   * @input {string} The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Prop() color: string;

  /**
   * @input {string} The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Prop() mode: 'ios' | 'md';

  /**
   * @input {boolean} If true, the segment button is selected. Defaults to `false`.
   */
  @Prop({ mutable: true }) checked: boolean = false;

  /*
   * @input {boolean} If true, the user cannot interact with the segment button. Default false.
   */
  @Prop({ mutable: true }) disabled: boolean = false;

  /**
   * @input {string} the value of the segment button.
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
      this.ionClick.emit();
    });
  }

  /**
   * Get the classes for the segment button state
   */
  getElementClassList() {
    let classList = [].concat(
      this.disabled ? 'segment-button-disabled' : [],
      this.activated ? 'segment-activated' : [],
    );

    return classList;
  }

  render() {
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

export interface SegmentButtonEvent extends CustomEvent {
  detail: SegmentButtonEventDetail;
}

export interface SegmentButtonEventDetail {

}
