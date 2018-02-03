import { Component, Element, Event, EventEmitter, Prop } from '@stencil/core';
import { createThemedClasses, getElementClassMap } from '../../utils/theme';


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

  @Prop({ mutable: true }) activated = false;

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
   * Contains a URL or a URL fragment that the hyperlink points to.
   * If this property is set, an anchor tag will be rendered.
   */
  @Prop() href: string;

  /**
   * The value of the segment button.
   */
  @Prop({ mutable: true }) value: string;

  /**
   * Emit the click event to the parent segment
   */
  private segmentButtonClick() {
    clearTimeout(this.styleTmr);

    this.styleTmr = setTimeout(() => {
      this.ionClick.emit();
    });
  }


  render() {
    const themedClasses = createThemedClasses(this.mode, this.color, 'segment-button');
    const hostClasses = getElementClassMap(this.el.classList);

    const buttonClasses = {
      'segment-button-disabled': this.disabled,
      'segment-activated': this.activated,
      ...themedClasses,
      ...hostClasses,
    };

    const TagType = this.href ? 'a' : 'button';

    return [
      <TagType
        aria-pressed={this.activated}
        class={buttonClasses}
        disabled={this.disabled}
        href={this.href}
        onClick={this.segmentButtonClick.bind(this)}>
          <slot></slot>
      </TagType>
    ];
  }
}

export interface SegmentButtonEvent extends CustomEvent {
  detail: SegmentButtonEventDetail;
}

export interface SegmentButtonEventDetail {

}
