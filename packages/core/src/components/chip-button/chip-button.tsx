import { Component, CssClassMap, Element, Prop } from '@stencil/core';

import { getElementClassObject } from '../../utils/theme';

@Component({
  tag: 'ion-chip-button',
  styleUrls: {
    ios: 'chip-button.ios.scss',
    md: 'chip-button.md.scss'
  },
})
export class ChipButton {
  @Element() private el: HTMLElement;

  /**
   * @input {string} Contains a URL or a URL fragment that the hyperlink points to.
   * If this property is set, an anchor tag will be rendered.
   */
  @Prop() href: string;

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
   * Set to `"clear"` for a transparent button style.
   */
  @Prop() fill: string;

  /**
   * @input {boolean} If true, sets the button into a disabled state.
   */
  @Prop() disabled: boolean = false;

  /**
   * Get the classes based on the button type
   * e.g. alert-button, action-sheet-button
   */
  private getButtonClassList(buttonType: string, mode: string): string[] {
    if (!buttonType) {
      return [];
    }
    return [
      buttonType,
      `${buttonType}-${mode}`
    ];
  }

  /**
   * Get the classes for the color
   */
  private getColorClassList(color: string, buttonType: string, style: string, mode: string): string[] {
    let className = (style === 'default') ? `${buttonType}` : `${buttonType}-${style}`;

    return [`${className}-${mode}`].concat(
        style !== 'default' ? `${className}` : [],
        color ? `${className}-${mode}-${color}` : []
      );
  }

  /**
   * Get the classes for the style
   * Chip buttons can only be clear or default (solid)
   */
  private getStyleClassList(buttonType: string): string[] {
    return this.getColorClassList(this.color, buttonType, this.fill || 'default', this.mode);
  }

  render() {
    const buttonType = 'chip-button';

    const hostClasses = getElementClassObject(this.el.classList);

    const elementClasses: CssClassMap = []
      .concat(
        this.getButtonClassList(buttonType, this.mode),
        this.getStyleClassList(buttonType)
      )
      .reduce((prevValue, cssClass) => {
        prevValue[cssClass] = true;
        return prevValue;
      }, {});

    const TagType = this.href ? 'a' : 'button';

    const buttonClasses = {
      ...hostClasses,
      ...elementClasses
    };

    return (
      <TagType class={buttonClasses} disabled={this.disabled}>
        <span class='button-inner'>
          <slot></slot>
        </span>
        <div class='button-effect'></div>
      </TagType>
    );
  }
}
