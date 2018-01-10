import { Component, Element, Event, EventEmitter, Prop } from '@stencil/core';
import { CssClassMap } from '../../index';
import { createThemedClasses, getElementClassObject } from '../../utils/theme';


@Component({
  tag: 'ion-segment-button'
})
export class SegmentButton {
  styleTmr: any;

  @Element() private el: HTMLElement;

  /**
   * Emitted when the segment button is clicked.
   */
  @Event() ionClick: EventEmitter<SegmentButtonEventDetail>;

  @Prop({mutable: true}) activated = false;

  /**
   * The color to use for the text color.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
   */
  @Prop() color: string;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   */
  @Prop() mode: 'ios' | 'md';

  /**
   * If true, the segment button is selected. Defaults to `false`.
   */
  @Prop({ mutable: true }) checked = false;

  /*
   * If true, the user cannot interact with the segment button. Default false.
   */
  @Prop({ mutable: true }) disabled = false;

  /**
   * The value of the segment button.
   */
  @Prop({ mutable: true }) value: string;

  segmentButtonClick(ev: UIEvent) {
    ev.preventDefault();
    ev.stopPropagation();

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
    const classList = [].concat(
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
