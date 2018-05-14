import { Component, Element, Event, EventEmitter, Prop, Watch } from '@stencil/core';
import { Color, Mode } from '../../interface';
import { createThemedClasses, getElementClassMap } from '../../utils/theme';

let ids = 0;

@Component({
  tag: 'ion-segment-button',
  styleUrls: {
    ios: 'segment-button.ios.scss',
    md: 'segment-button.md.scss'
  }
})
export class SegmentButton {

  @Element() el!: HTMLElement;

  /**
   * The color to use for the text color.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   */
  @Prop() color?: Color;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   */
  @Prop() mode!: Mode;

  /**
   * If true, the segment button is selected. Defaults to `false`.
   */
  @Prop({mutable: true}) checked = false;

  /*
   * If true, the user cannot interact with the segment button. Default false.
   */
  @Prop() disabled = false;

  /**
   * Contains a URL or a URL fragment that the hyperlink points to.
   * If this property is set, an anchor tag will be rendered.
   */
  @Prop() href?: string;

  /**
   * The value of the segment button.
   */
  @Prop() value: string = 'ion-sb-' + (ids++);

  /**
   * Emitted when the segment button is clicked.
   */
  @Event() ionSelect!: EventEmitter<void>;

  @Watch('checked')
  checkedChanged(checked: boolean, prev: boolean) {
    if (checked && !prev) {
      this.ionSelect.emit();
    }
  }

  render() {
    const themedClasses = createThemedClasses(this.mode, this.color, 'segment-button');
    const hostClasses = getElementClassMap(this.el.classList);

    const buttonClasses = {
      'segment-button-disabled': this.disabled,
      'segment-checked': this.checked,
      ...themedClasses,
      ...hostClasses,
    };

    const TagType = this.href ? 'a' : 'button';
    const attrs = (TagType === 'button')
      ? {type: 'button'}
      : {};

    return [
      <TagType
       {...attrs}
        aria-pressed={this.checked}
        class={buttonClasses}
        disabled={this.disabled}
        href={this.href}
        onClick={() => this.checked = true }>
          <slot></slot>
          { this.mode === 'md' && <ion-ripple-effect tapClick={true}/> }
      </TagType>
    ];
  }
}
